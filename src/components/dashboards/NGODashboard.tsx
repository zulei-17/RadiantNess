import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Package, Plus, Clock, CheckCircle, AlertCircle, TrendingUp, Users, MapPin } from "lucide-react";
import { db, auth, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, updateDoc, doc, limit } from "firebase/firestore";
import { cn } from "../../lib/utils";

export default function NGODashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [newDonation, setNewDonation] = useState({ productType: "Pads", amount: 100 });

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch NGO Profile
    const unsubscribeProfile = onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data());
      }
    });

    // Listen for all pending requests
    const qRequests = query(
      collection(db, "requests"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "requests");
    });

    // Listen for NGO's own donations
    const qDonations = query(
      collection(db, "donations"),
      orderBy("timestamp", "desc"),
      limit(20)
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

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "requests", requestId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `requests/${requestId}`);
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, "donations"), {
        donorUid: auth.currentUser.uid,
        productType: newDonation.productType,
        amount: newDonation.amount,
        timestamp: serverTimestamp(),
      });
      setShowDonationModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "donations");
    }
  };

  return (
    <div className="space-y-8">
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

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <span className="text-3xl font-serif text-radiant-pink">{requests.filter(r => r.status === "pending").length}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Pending Requests</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <span className="text-3xl font-serif text-radiant-pink">
            {donations.reduce((acc, curr) => acc + (curr.amount || 0), 0)}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Donated</p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-serif mb-4">Pending Requests</h3>
        <div className="space-y-3">
          {requests.filter(r => r.status === "pending").map((request) => (
            <div key={request.id} className="bg-white p-4 rounded-[20px] border border-black/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-radiant-bg flex items-center justify-center text-radiant-pink">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{request.productType}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Qty: {request.quantity}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(request.id, "approved")}
                    className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-green-100 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
          {requests.filter(r => r.status === "pending").length === 0 && (
            <p className="text-center py-12 text-gray-400 italic text-sm">No pending requests. Great job!</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-serif mb-4">Recent Donations</h3>
        <div className="space-y-3">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white p-4 rounded-[20px] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-radiant-bg flex items-center justify-center text-radiant-pink">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{donation.productType}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Amount: {donation.amount}</p>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {donation.timestamp?.toDate().toLocaleDateString()}
              </div>
            </div>
          ))}
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
            <form onSubmit={handleSubmitDonation} className="space-y-4">
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
                  <option>Funds (USD)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Amount / Quantity</label>
                <input 
                  type="number"
                  value={newDonation.amount}
                  onChange={(e) => setNewDonation({ ...newDonation, amount: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-full text-sm font-medium bg-radiant-pink text-white shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform"
                >
                  Log Donation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
