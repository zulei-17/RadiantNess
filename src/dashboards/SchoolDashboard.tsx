import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Package, Plus, Clock, CheckCircle, AlertCircle, BarChart3, ClipboardList, LogOut, RefreshCw, Megaphone, Trash2, Settings, UserPlus, Shield, Building2 } from "lucide-react";
import { db, auth, handleFirestoreError, OperationType, resetUserData, logout } from "../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { cn } from "../lib/utils";
import WellBeingAnalytics from "./WellBeingAnalytics";

export default function SchoolDashboard({ user }: { user: any }) {
  const [activeSubTab, setActiveSubTab] = useState<"supplies" | "analytics" | "announcements" | "settings">("analytics");
  const [requests, setRequests] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newRequest, setNewRequest] = useState({ productType: "Pads", quantity: 50 });
  const [newAnnouncement, setNewAnnouncement] = useState({
    type: "supplies" as "supplies" | "workshop" | "session" | "general",
    title: "",
    content: ""
  });

  // Settings State
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editProfile, setEditProfile] = useState({
    displayName: "",
    school_location: { city: "", country: "", address: "" }
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch Profile
    const unsubscribeProfile = onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProfile(data);
        setEditProfile({
          displayName: data.displayName || "",
          school_location: data.onboardingData?.school_location || { city: "", country: "", address: "" }
        });
      }
    });

    // Fetch Requests
    const qRequests = query(
      collection(db, "requests"),
      where("requesterUid", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "requests");
    });

    // Fetch Announcements
    const qAnnouncements = query(
      collection(db, "announcements"),
      where("schoolUid", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribeAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "announcements");
    });

    return () => {
      unsubscribeProfile();
      unsubscribeRequests();
      unsubscribeAnnouncements();
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
        location: profile?.onboardingData?.school_location || profile?.onboardingData?.ngo_location || null,
        timestamp: serverTimestamp(),
      });
      setShowRequestModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "requests");
    }
  };

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, "announcements"), {
        schoolUid: auth.currentUser.uid,
        schoolName: profile?.displayName || "Your School",
        type: newAnnouncement.type,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        timestamp: serverTimestamp(),
      });
      setShowAnnouncementModal(false);
      setNewAnnouncement({ type: "supplies", title: "", content: "" });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "announcements");
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
      setShowDeleteConfirm(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsSavingProfile(true);
    setSaveSuccess(false);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: editProfile.displayName,
        "onboardingData.school_location": editProfile.school_location
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
    } finally {
      setIsSavingProfile(false);
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

      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif">
            {profile?.displayName || (profile?.userRole === "parent" ? "Parent Dashboard" : "School Dashboard")}
          </h1>
          <p className="text-gray-500 text-sm italic">
            {profile?.userRole === "parent" 
              ? `Supporting ${profile?.onboardingData?.parent_basic?.studentName || "your student"}'s growth.`
              : "Support your students and monitor well-being."}
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
          <button 
            onClick={() => setActiveSubTab("announcements")}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeSubTab === "announcements" ? "bg-radiant-pink text-white shadow-md" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Megaphone size={14} />
            Announcements
          </button>
          <button 
            onClick={() => setActiveSubTab("settings")}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeSubTab === "settings" ? "bg-radiant-pink text-white shadow-md" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Settings size={14} />
            Settings
          </button>
        </div>
      </header>

      {activeSubTab === "analytics" ? (
        <WellBeingAnalytics />
      ) : activeSubTab === "supplies" ? (
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
      ) : activeSubTab === "announcements" ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif">Announcements</h3>
              <button 
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-radiant-pink text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Plus size={14} />
                New Announcement
              </button>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest",
                        announcement.type === "supplies" ? "bg-green-100 text-green-600" :
                        announcement.type === "workshop" ? "bg-blue-100 text-blue-600" :
                        announcement.type === "session" ? "bg-purple-100 text-purple-600" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        {announcement.type}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {announcement.timestamp?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm(announcement.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="font-serif text-lg mb-2">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{announcement.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-center py-12 text-gray-400 italic text-sm">No announcements yet. Keep your students informed!</p>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="grid md:grid-cols-3 gap-6">
            {/* School Profile */}
            <div className="md:col-span-2 bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-radiant-pink" size={24} />
                <h3 className="text-xl font-serif">School Profile</h3>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">School Name</label>
                  <input 
                    type="text"
                    value={editProfile.displayName}
                    onChange={(e) => setEditProfile({ ...editProfile, displayName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">City</label>
                    <input 
                      type="text"
                      value={editProfile.school_location.city}
                      onChange={(e) => setEditProfile({ 
                        ...editProfile, 
                        school_location: { ...editProfile.school_location, city: e.target.value } 
                      })}
                      className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Country</label>
                    <input 
                      type="text"
                      value={editProfile.school_location.country}
                      onChange={(e) => setEditProfile({ 
                        ...editProfile, 
                        school_location: { ...editProfile.school_location, country: e.target.value } 
                      })}
                      className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Address</label>
                  <input 
                    type="text"
                    value={editProfile.school_location.address}
                    onChange={(e) => setEditProfile({ 
                      ...editProfile, 
                      school_location: { ...editProfile.school_location, address: e.target.value } 
                    })}
                    className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSavingProfile}
                  className={cn(
                    "w-full py-3 rounded-full text-sm font-medium shadow-lg transition-all",
                    saveSuccess 
                      ? "bg-green-500 text-white shadow-green-500/20" 
                      : "bg-radiant-pink text-white shadow-radiant-pink/20 hover:scale-105"
                  )}
                >
                  {isSavingProfile ? "Saving..." : saveSuccess ? "Changes Saved!" : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Staff Access & Permissions */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <UserPlus className="text-radiant-pink" size={20} />
                  <h3 className="text-lg font-serif">Staff Access</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">Manage who can access this dashboard.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-radiant-bg rounded-xl border border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold">JD</div>
                      <div>
                        <p className="text-xs font-medium">Jane Doe</p>
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest">Admin</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 border-2 border-dashed border-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-radiant-pink/20 hover:text-radiant-pink transition-all">
                    Add Staff Member
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-radiant-pink" size={20} />
                  <h3 className="text-lg font-serif">Permissions</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Allow staff to post announcements</span>
                    <div className="w-8 h-4 bg-radiant-pink rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Allow staff to request supplies</span>
                    <div className="w-8 h-4 bg-radiant-pink rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">View analytics data</span>
                    <div className="w-8 h-4 bg-radiant-pink rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
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

      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl"
          >
            <h2 className="text-2xl font-serif mb-6">New Announcement</h2>
            <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Type</label>
                <select 
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                  className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                >
                  <option value="supplies">Supplies Available</option>
                  <option value="workshop">Workshop</option>
                  <option value="session">Session</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Title</label>
                <input 
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="e.g. New Supplies Arrived!"
                  className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Content</label>
                <textarea 
                  required
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Details about the announcement..."
                  className="w-full p-3 rounded-xl border border-black/5 bg-radiant-bg focus:outline-none focus:ring-2 focus:ring-radiant-pink/20 h-32 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-full text-sm font-medium bg-radiant-pink text-white shadow-lg shadow-radiant-pink/20 hover:scale-105 transition-transform"
                >
                  Post
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h2 className="text-2xl font-serif mb-2">Delete Announcement?</h2>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteAnnouncement(showDeleteConfirm)}
                className="flex-1 py-3 rounded-full text-sm font-medium bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
              >
                Delete
              </button>
            </div>
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
