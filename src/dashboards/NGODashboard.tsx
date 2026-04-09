import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Package, Plus, Clock, CheckCircle, AlertCircle, TrendingUp, Users, MapPin, School, User, RefreshCw, LogOut, Truck } from "lucide-react";
import { db, auth, handleFirestoreError, OperationType, resetUserData, logout } from "../lib/firebase";
import { collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, updateDoc, doc, limit, Timestamp } from "firebase/firestore";
import { cn } from "../lib/utils";

type RequestStatus = "pending" | "approved" | "in-progress" | "shipped" | "delivered";

export default function NGODashboard({ user }: { user: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [displayRequests, setDisplayRequests] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [activeRequestTab, setActiveRequestTab] = useState<RequestStatus>("pending");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Rejection Modal State
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionStep, setRejectionStep] = useState<"reason" | "confirm">("reason");

  // Info Modal State
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Donation Modal State
  const [donationStep, setDonationStep] = useState(1);
  const [newDonation, setNewDonation] = useState({
    donorType: "school" as "school" | "individual",
    schoolName: "",
    productType: "Pads",
    amount: 100,
    brand: "",
    urgency: "within this month" as "within a week" | "within this month" | "within the next 2 months"
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch NGO Profile
    const unsubscribeProfile = onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data());
      }
    });

    // Listen for all requests
    const qRequests = query(
      collection(db, "requests"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribeRequests = onSnapshot(qRequests, { includeMetadataChanges: true }, (snapshot) => {
      setRequests(prev => {
        const next = [...prev];
        snapshot.docChanges().forEach(change => {
          const data = { id: change.doc.id, ...change.doc.data() };
          if (change.type === 'added') {
            if (!next.find(r => r.id === data.id)) next.push(data);
          } else if (change.type === 'modified') {
            const index = next.findIndex(r => r.id === data.id);
            if (index !== -1) next[index] = data;
          } else if (change.type === 'removed') {
            const index = next.findIndex(r => r.id === data.id);
            if (index !== -1) next.splice(index, 1);
          }
        });
        return next.sort((a, b) => {
          const tA = (a.timestamp as Timestamp)?.toMillis() || 0;
          const tB = (b.timestamp as Timestamp)?.toMillis() || 0;
          return tB - tA;
        });
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "requests");
    });

    // Listen for NGO's own donations
    const qDonations = query(
      collection(db, "donations"),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    const unsubscribeDonations = onSnapshot(qDonations, (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "donations");
    });

    return () => {
      unsubscribeProfile();
      unsubscribeRequests();
      unsubscribeDonations();
    };
  }, []);

  // Sticky filtering to prevent flickering when status updates
  useEffect(() => {
    setDisplayRequests(prev => {
      // 1. Update existing items in the display list with latest data from Firestore
      const updatedPrev = prev.map(p => {
        const latest = requests.find(r => r.id === p.id);
        return latest || p;
      });

      // 2. Add new items that match the current tab and aren't already displayed
      const currentTabItems = requests.filter(r => r.status === activeRequestTab);
      const newItems = currentTabItems.filter(r => !prev.find(p => p.id === r.id));
      
      // 3. Combine and sort
      return [...updatedPrev, ...newItems].sort((a, b) => {
        const tA = (a.timestamp as Timestamp)?.toMillis() || 0;
        const tB = (b.timestamp as Timestamp)?.toMillis() || 0;
        return tB - tA;
      });
    });
  }, [requests, activeRequestTab]);

  // When tab changes, we reset the display list to only items matching the new tab
  useEffect(() => {
    setDisplayRequests(requests.filter(r => r.status === activeRequestTab));
  }, [activeRequestTab]);

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "requests", requestId), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `requests/${requestId}`);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequestId) return;
    try {
      await updateDoc(doc(db, "requests", selectedRequestId), { 
        status: "rejected",
        rejectionReason: rejectionReason
      });
      setShowRejectionModal(false);
      setSelectedRequestId(null);
      setRejectionReason("");
      setRejectionStep("reason");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `requests/${selectedRequestId}`);
    }
  };

  const handleShipDonation = async (donationId: string) => {
    try {
      await updateDoc(doc(db, "donations", donationId), { status: "shipped" });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `donations/${donationId}`);
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, "donations"), {
        donorUid: auth.currentUser.uid,
        donorType: newDonation.donorType,
        schoolName: newDonation.donorType === "school" ? newDonation.schoolName : null,
        productType: newDonation.productType,
        amount: newDonation.amount,
        brand: newDonation.brand || null,
        urgency: newDonation.donorType === "school" ? newDonation.urgency : null,
        status: "approved", // Starts as approved/outstanding
        timestamp: serverTimestamp(),
      });
      setShowDonationModal(false);
      setDonationStep(1);
      setNewDonation({
        donorType: "school",
        schoolName: "",
        productType: "Pads",
        amount: 100,
        brand: "",
        urgency: "within this month"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "donations");
    }
  };

  const totalDonated = donations
    .filter(d => d.status === "shipped")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalOutstanding = donations
    .filter(d => d.status === "approved")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-3 -mb-4">
        <button 
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
        >
          <RefreshCw size={12} />
          Reset Profile
        </button>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-radiant-pink transition-colors"
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </div>

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">
            {profile?.displayName || "NGO Dashboard"}
          </h1>
          <p className="text-gray-500 text-sm italic">
            {profile?.onboardingData?.donation_specialization === 'other' 
              ? profile?.onboardingData?.other_specialization?.other_spec 
              : profile?.onboardingData?.donation_specialization || "Empowering youth through support."}
          </p>
          {profile?.onboardingData?.ngo_location?.city && (
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
              <MapPin size={10} />
              {profile.onboardingData.ngo_location.city}, {profile.onboardingData.ngo_location.country}
            </p>
          )}
        </div>
        <button 
          onClick={() => setShowDonationModal(true)}
          className="bg-radiant-pink text-white p-3 rounded-full shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <span className="text-3xl font-serif text-radiant-pink">{requests.filter(r => r.status === "pending").length}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Pending Requests</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <span className="text-3xl font-serif text-radiant-pink">
            {totalDonated}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Donated</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <span className="text-3xl font-serif text-radiant-pink">
            {totalOutstanding}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Outstanding</p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif">Manage Requests</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["pending", "approved", "in-progress", "shipped", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveRequestTab(status as any)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all whitespace-nowrap",
                  activeRequestTab === status ? "bg-radiant-pink text-white border-radiant-pink" : "bg-white text-gray-400 border-black/5"
                )}
              >
                {status.replace("-", " ")} ({requests.filter(r => r.status === status).length})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {activeRequestTab.replace("-", " ")} Requests
            </h4>
            {displayRequests.map((request) => (
              <div key={request.id} className={cn(
                "bg-white p-4 rounded-[20px] border transition-all duration-500",
                request.status !== activeRequestTab ? "opacity-60 grayscale-[0.5]" : "border-black/5"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      request.status === "pending" ? "bg-radiant-bg text-radiant-pink" :
                      request.status === "approved" ? "bg-blue-50 text-blue-500" :
                      request.status === "in-progress" ? "bg-orange-50 text-orange-500" :
                      request.status === "shipped" ? "bg-purple-50 text-purple-500" :
                      "bg-green-50 text-green-500"
                    )}>
                      {request.status === "pending" ? <Clock size={20} /> :
                       request.status === "approved" ? <CheckCircle size={20} /> :
                       request.status === "in-progress" ? <RefreshCw size={20} className="animate-spin-slow" /> :
                       request.status === "shipped" ? <Truck size={20} /> :
                       <CheckCircle size={20} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{request.productType}</h4>
                      <div className="flex flex-col">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Qty: {request.quantity}</p>
                        {request.location && (
                          <p className="text-[10px] text-radiant-pink flex items-center gap-1 mt-0.5">
                            <MapPin size={10} />
                            {request.location.city}, {request.location.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowInfoModal(true);
                      }}
                      className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Info
                    </button>

                    {request.status === "pending" && (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedRequestId(request.id);
                            setShowRejectionModal(true);
                          }}
                          className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-red-100 transition-colors"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(request.id, "approved")}
                          className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-green-100 transition-colors"
                        >
                          Approve
                        </button>
                      </>
                    )}

                    {request.status === "approved" && (
                      <button 
                        onClick={() => handleUpdateStatus(request.id, "in-progress")}
                        className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-orange-100 transition-colors"
                      >
                        Start Processing
                      </button>
                    )}

                    {request.status === "in-progress" && (
                      <button 
                        onClick={() => handleUpdateStatus(request.id, "shipped")}
                        className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-purple-100 transition-colors"
                      >
                        Mark Shipped
                      </button>
                    )}

                    {request.status === "shipped" && (
                      <button 
                        onClick={() => handleUpdateStatus(request.id, "delivered")}
                        className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-green-100 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {request.status !== activeRequestTab && (
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={10} />
                        Updated
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {displayRequests.length === 0 && (
              <p className="text-center py-8 text-gray-400 italic text-sm">No {activeRequestTab.replace("-", " ")} requests.</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-serif mb-4">Logged Donations</h3>
        <div className="space-y-3">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white p-4 rounded-[20px] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  donation.status === "shipped" ? "bg-green-50 text-green-600" : "bg-radiant-bg text-radiant-pink"
                )}>
                  {donation.status === "shipped" ? <CheckCircle size={20} /> : <TrendingUp size={20} />}
                </div>
                <div>
                  <h4 className="font-medium text-sm">
                    {donation.productType} ({donation.amount})
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    To: {donation.donorType === "school" ? donation.schoolName : "Individual"}
                    {donation.brand && ` • Brand: ${donation.brand}`}
                  </p>
                  {donation.urgency && (
                    <p className="text-[9px] text-radiant-pink font-bold uppercase tracking-widest mt-0.5">
                      Urgency: {donation.urgency}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {donation.timestamp?.toDate().toLocaleDateString()}
                </div>
                {donation.status === "approved" && (
                  <button
                    onClick={() => handleShipDonation(donation.id)}
                    className="px-3 py-1 bg-radiant-pink text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
                  >
                    Ship Now
                  </button>
                )}
              </div>
            </div>
          ))}
          {donations.length === 0 && (
            <p className="text-center py-8 text-gray-400 italic text-sm">No donations logged yet.</p>
          )}
        </div>
      </section>

      {showDonationModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl"
          >
            <h2 className="text-2xl font-serif mb-6">Log Donation</h2>
            
            {donationStep === 1 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 italic">Who is this donation for?</p>
                <div className="grid gap-4">
                  <button
                    onClick={() => {
                      setNewDonation({ ...newDonation, donorType: "school" });
                      setDonationStep(2);
                    }}
                    className="flex items-center gap-4 p-6 bg-radiant-bg rounded-2xl hover:bg-radiant-pink/5 border border-black/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-radiant-pink shadow-sm group-hover:bg-radiant-pink group-hover:text-white transition-all">
                      <School size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">School</h4>
                      <p className="text-xs text-gray-400">Donating to a specific educational institution.</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setNewDonation({ ...newDonation, donorType: "individual" });
                      setDonationStep(2);
                    }}
                    className="flex items-center gap-4 p-6 bg-radiant-bg rounded-2xl hover:bg-radiant-pink/5 border border-black/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-radiant-pink shadow-sm group-hover:bg-radiant-pink group-hover:text-white transition-all">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Individual</h4>
                      <p className="text-xs text-gray-400">Direct support for a single student or person.</p>
                    </div>
                  </button>
                </div>
                <button 
                  onClick={() => setShowDonationModal(false)}
                  className="w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}

            {donationStep === 2 && (
              <form onSubmit={handleSubmitDonation} className="space-y-4">
                {newDonation.donorType === "school" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">School Name</label>
                    <input 
                      type="text"
                      required
                      value={newDonation.schoolName}
                      onChange={(e) => setNewDonation({ ...newDonation, schoolName: e.target.value })}
                      placeholder="e.g. Radiant High"
                      className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Product Type</label>
                  <select 
                    value={newDonation.productType}
                    onChange={(e) => setNewDonation({ ...newDonation, productType: e.target.value })}
                    className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                  >
                    <option>Pads</option>
                    <option>Tampons</option>
                    <option>Sanitary Cups</option>
                    <option>Hygiene Kits</option>
                    <option>Stationery</option>
                    <option>Uniforms</option>
                    <option>Funds (USD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Quantity / Amount</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                  />
                </div>

                {(newDonation.productType === "Pads" || newDonation.productType === "Tampons" || newDonation.productType === "Sanitary Cups") && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Brand (Optional)</label>
                    <input 
                      type="text"
                      value={newDonation.brand}
                      onChange={(e) => setNewDonation({ ...newDonation, brand: e.target.value })}
                      placeholder="e.g. Always, Kotex"
                      className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                    />
                  </div>
                )}

                {newDonation.donorType === "school" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Urgency</label>
                    <select 
                      value={newDonation.urgency}
                      onChange={(e) => setNewDonation({ ...newDonation, urgency: e.target.value as any })}
                      className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                    >
                      <option value="within a week">Within a week</option>
                      <option value="within this month">Within this month</option>
                      <option value="within the next 2 months">Within the next 2 months</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setDonationStep(1)}
                    className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-full text-sm font-medium bg-radiant-pink text-white shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform"
                  >
                    Log Donation
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl"
          >
            {rejectionStep === "reason" ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-serif">Decline Request</h2>
                <p className="text-sm text-gray-500">Please provide a reason for declining this request.</p>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="w-full p-4 rounded-2xl border border-black/5 bg-radiant-bg h-32 focus:outline-none focus:ring-2 focus:ring-radiant-pink/20 text-sm"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowRejectionModal(false)}
                    className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!rejectionReason.trim()}
                    onClick={() => setRejectionStep("confirm")}
                    className="flex-1 py-3 rounded-full text-sm font-medium bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif">Are you sure?</h2>
                  <p className="text-sm text-gray-500">
                    This will be recorded & may affect your reputation as a reliable donor.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setRejectionStep("reason")}
                    className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleRejectRequest}
                    className="flex-1 py-3 rounded-full text-sm font-medium bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
                  >
                    Confirm Decline
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {showInfoModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl"
          >
            <h2 className="text-2xl font-serif mb-4">Request Details</h2>
            <div className="space-y-4">
              <div className="bg-radiant-bg p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Product</p>
                <p className="font-medium">{selectedRequest.productType}</p>
              </div>
              <div className="bg-radiant-bg p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Quantity</p>
                <p className="font-medium">{selectedRequest.quantity}</p>
              </div>
              {selectedRequest.location && (
                <div className="bg-radiant-bg p-4 rounded-2xl border border-black/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Location</p>
                  <p className="font-medium">{selectedRequest.location.city}, {selectedRequest.location.country}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedRequest.location.address}</p>
                </div>
              )}
              <div className="bg-radiant-bg p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Requested On</p>
                <p className="font-medium">{selectedRequest.timestamp?.toDate().toLocaleString()}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-6 py-3 rounded-full text-sm font-medium bg-radiant-pink text-white shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
              <RefreshCw size={32} />
            </div>
            <h2 className="text-2xl font-serif mb-2">Reset Profile?</h2>
            <p className="text-sm text-gray-500 mb-6">
              This will clear all your onboarding data and sign you out. This action is permanent.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => resetUserData()}
                className="flex-1 py-3 rounded-full text-sm font-medium bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
