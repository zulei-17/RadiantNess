import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Package, Plus, Clock, CheckCircle, AlertCircle, BarChart3, ClipboardList } from "lucide-react";
import { db, auth, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, doc } from "firebase/firestore";
import { cn } from "../lib/utils";
import WellBeingAnalytics from "./WellBeingAnalytics";

export default function ParentDashboard({ user }: { user: any }) {
  const [activeSubTab, setActiveSubTab] = useState<"supplies" | "analytics">("analytics");
  const [requests, setRequests] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ productType: "Pads", quantity: 50 });

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch Profile
    const unsubscribeProfile = onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data());
      }
    });

    const q = query(
      collection(db, "requests"),
      where("requesterUid", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "requests");
    });

    return () => {
      unsubscribeProfile();
      unsubscribe();
    };
  }, []);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, "requests"), {
        requesterUid: auth.currentUser.uid,
        productType: newRequest.productType,
        quantity: newRequest.quantity,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      setShowRequestModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "requests");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="text-orange-500" size={18} />;
      case "approved": return <CheckCircle className="text-blue-500" size={18} />;
      case "rejected": return <AlertCircle className="text-red-500" size={18} />;
      case "shipped": return <Package className="text-purple-500" size={18} />;
      case "delivered": return <CheckCircle className="text-green-500" size={18} />;
      default: return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif">
            {profile?.displayName || "Parent Dashboard"}
          </h1>
          <p className="text-gray-500 text-sm italic">
            Supporting {profile?.onboardingData?.parent_basic?.studentName || "your student"}'s growth.
          </p>
        </div>
        <div className="flex bg-white rounded-full p-1 border border-black/5 shadow-sm">
          <button 
            onClick={() => setActiveSubTab("analytics")}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeSubTab === "analytics" ? "bg-radiant-pink text-white shadow-md" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <BarChart3 size={14} />
            Analytics
          </button>
          <button 
            onClick={() => setActiveSubTab("supplies")}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeSubTab === "supplies" ? "bg-radiant-pink text-white shadow-md" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <ClipboardList size={14} />
            Supplies
          </button>
        </div>
      </header>

      {activeSubTab === "analytics" ? (
        <WellBeingAnalytics />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
              <span className="text-3xl font-serif text-radiant-pink">{requests.length}</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Requests</p>
            </div>
            <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
              <span className="text-3xl font-serif text-radiant-pink">
                {requests.filter(r => r.status === "pending").length}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Pending</p>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif">Recent Requests</h3>
              <button 
                onClick={() => setShowRequestModal(true)}
                className="bg-radiant-pink text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Plus size={14} />
                New Request
              </button>
            </div>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="bg-white p-4 rounded-[20px] border border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-radiant-bg flex items-center justify-center text-radiant-pink">
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{request.productType}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Qty: {request.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                    {getStatusIcon(request.status)}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <p className="text-center py-12 text-gray-400 italic text-sm">No requests yet. Start by creating one!</p>
              )}
            </div>
          </section>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl"
          >
            <h2 className="text-2xl font-serif mb-6">New Supply Request</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Product Type</label>
                <select 
                  value={newRequest.productType}
                  onChange={(e) => setNewRequest({ ...newRequest, productType: e.target.value })}
                  className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                >
                  <option>Pads</option>
                  <option>Tampons</option>
                  <option>Sanitary Cups</option>
                  <option>Hygiene Kits</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Quantity</label>
                <input 
                  type="number"
                  value={newRequest.quantity}
                  onChange={(e) => setNewRequest({ ...newRequest, quantity: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-full text-sm font-medium bg-radiant-pink text-white shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
