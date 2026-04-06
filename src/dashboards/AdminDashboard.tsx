import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Package, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, onSnapshot, limit, getCountFromServer } from "firebase/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    requests: 0,
    donations: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

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
    const qUsers = query(collection(db, "users"), limit(10));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setRecentUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "users");
    });

    return () => unsubscribeUsers();
  }, []);

  return (
    <div className="space-y-8">
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
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
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
          ))}
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
    </div>
  );
}
