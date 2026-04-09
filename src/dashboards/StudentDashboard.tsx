import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Package, RefreshCw, LogOut, Megaphone, Bell } from "lucide-react";
import MoodTracker from "../components/MoodTracker";
import { db, auth, handleFirestoreError, OperationType, resetUserData, logout } from "../lib/firebase";
import { cn } from "../lib/utils";
import RequestForm from "../components/RequestForm";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

interface StudentDashboardProps {
  user: { role: string; [key: string]: any };
  userName?: string;
  streak?: number;
  confidenceScore?: number;
  onboardingData?: any;
}

export default function StudentDashboard({
  user,
  userName = "Radiant",
  streak = 0,
  confidenceScore = 0,
}: StudentDashboardProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const needsSupplies = user?.needsSupplies === true;

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "announcements");
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
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
          <h1 className="text-4xl font-serif">Hello, {userName}.</h1>
          <p className="text-gray-500 text-sm italic">Ready to shine today?</p>
        </div>
      </header>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="text-radiant-pink" size={20} />
            <h3 className="text-lg font-serif">School Announcements</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {announcements.map((announcement) => (
              <motion.div 
                key={announcement.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 w-72 bg-white p-5 rounded-[24px] border border-black/5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
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
                    {announcement.schoolName}
                  </span>
                </div>
                <h4 className="font-bold text-sm mb-1">{announcement.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{announcement.content}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <MoodTracker />

      <section className="bg-radiant-pink text-white rounded-[32px] p-8 relative overflow-hidden shadow-lg shadow-radiant-pink/20">
        <div className="relative z-10">
          <h3 className="text-2xl font-serif mb-2">Daily Mission</h3>
          <p className="text-white/80 text-sm mb-6">
            Compliment a stranger today. It builds confidence for both of you.
          </p>
          <button className="bg-white text-radiant-pink px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-pink-50 transition-colors">
            Accept Mission
          </button>
        </div>
        <Sparkles className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-serif">Your Progress</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
            <span className="text-3xl font-serif text-radiant-pink">{streak}</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
              Day Streak
            </p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
            <span className="text-3xl font-serif text-radiant-pink">
              {confidenceScore}%
            </span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
              Confidence Score
            </p>
          </div>
        </div>
      </section>

      {/* ✅ SUPPORT SECTION (UPDATED WITH REQUEST FORM) */}
      <section
        className={cn(
          "p-8 rounded-[32px] border shadow-sm transition-all duration-500",
          needsSupplies
            ? "bg-radiant-pink/5 border-radiant-pink/20 ring-4 ring-radiant-pink/5"
            : "bg-white border-black/5"
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-radiant-pink" size={24} />
          <h3 className="text-xl font-serif">
            {needsSupplies ? "We're Here to Help" : "Sanitary Support"}
          </h3>
        </div>

        <p className="text-sm text-gray-500 mb-6 italic leading-relaxed">
          {needsSupplies
            ? "We noticed you're facing some challenges with school supplies. Don't worry—RadiantNess and your school are here to support you."
            : "Need supplies? Your school is here to help."}
        </p>

        {/* 🔥 NEW WORKING REQUEST SYSTEM */}
        <RequestForm user={user} />
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
    </motion.div>
  );
}