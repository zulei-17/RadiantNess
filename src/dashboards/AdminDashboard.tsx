import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Package, TrendingUp, Shield, BarChart3, RefreshCw, LogOut } from "lucide-react";
import { db, handleFirestoreError, OperationType, resetUserData, logout } from "../lib/firebase";
import { collection, query, onSnapshot, limit, getCountFromServer } from "firebase/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    requests: 0,
    donations: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [privateDetails, setPrivateDetails] = useState<Record<string, any>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Fetch counts
    const fetchCounts = async () => {
      try {
        const userCount = await getCountFromServer(collection(db, "users"));
        const requestCount = await getCountFromServer(collection(db, "requests"));
        const donationCount = await getCountFromServer(collection(db, "donations"));
        setStats({
          users: userCount.data().count,
          requests: requestCount.data().count,
          donations: donationCount.data().count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();

    // Listen for recent users
    const qUsers = query(collection(db, "users"), limit(20));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentUsers(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "users");
    });

    // Listen for private details (Admin only)
    const qPrivate = query(collection(db, "student_private_details"));
    const unsubscribePrivate = onSnapshot(qPrivate, (snapshot) => {
      const details: Record<string, any> = {};
      snapshot.docs.forEach(doc => {
        details[doc.id] = doc.data();
      });
      setPrivateDetails(details);
    }, (error) => {
      // It's okay if this fails if the user is not an admin, but here we are in AdminDashboard
      console.warn("Could not fetch private details:", error);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePrivate();
    };
  }, []);

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

      <header>
        <h1 className="text-3xl font-serif">Admin Console</h1>
        <p className="text-gray-500 text-sm italic">Platform overview and management.</p>
      </header>

      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Users size={20} />
          </div>
          <span className="text-2xl font-serif text-radiant-ink">{stats.users}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Users</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
            <Package size={20} />
          </div>
          <span className="text-2xl font-serif text-radiant-ink">{stats.requests}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Requests</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <span className="text-2xl font-serif text-radiant-ink">{stats.donations}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Donations</p>
        </div>
      </section>

      <section className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-radiant-pink" size={24} />
          <h3 className="text-xl font-serif">Platform Activity</h3>
        </div>
        <div className="space-y-4">
          {recentUsers.map((user) => {
            const details = privateDetails[user.id];
            return (
              <div key={user.id} className="flex flex-col py-4 border-b border-black/5 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-radiant-bg flex items-center justify-center text-radiant-pink text-xs font-bold">
                      {user.displayName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{user.displayName}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{user.userRole}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {user.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>
                
                {details && (
                  <div className="ml-11 mt-2 p-4 bg-gray-50 rounded-2xl border border-black/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-gray-400 uppercase tracking-widest">Email:</span>
                      <span className="text-gray-600">{details.email}</span>
                    </div>
                    {details.onboardingData?.answers && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Onboarding Answers:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(details.onboardingData.answers).map(([key, val]: [string, any]) => (
                            <div key={key} className="text-[10px] bg-white p-2 rounded-lg border border-black/5">
                              <span className="text-gray-400 block">{key}:</span>
                              <span className="text-gray-600 font-medium">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-radiant-pink text-white rounded-[32px] p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-serif mb-2">System Health</h3>
          <p className="text-white/80 text-sm mb-6">All systems operational. Security rules enforced.</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Protected</span>
            </div>
          </div>
        </div>
      </section>

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
