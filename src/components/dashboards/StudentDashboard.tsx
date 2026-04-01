import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Package, Heart, TrendingUp, CheckCircle } from "lucide-react";
import MoodTracker from "../MoodTracker";
import { db, auth, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface StudentDashboardProps {
  userName: string;
  streak: number;
  confidenceScore: number;
}

export default function StudentDashboard({ userName, streak, confidenceScore }: StudentDashboardProps) {
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleRequestSupplies = async () => {
    if (!auth.currentUser) return;
    setRequestStatus("loading");

    try {
      await addDoc(collection(db, "requests"), {
        requesterUid: auth.currentUser.uid,
        productType: "Pads (Standard)",
        quantity: 1,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      setRequestStatus("success");
      setTimeout(() => setRequestStatus("idle"), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "requests");
      setRequestStatus("idle");
    }
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif">Hello, {userName}.</h1>
          <p className="text-gray-500 text-sm italic">Ready to shine today?</p>
        </div>
      </header>

      <MoodTracker />

      <section className="bg-radiant-pink text-white rounded-[32px] p-8 relative overflow-hidden shadow-lg shadow-radiant-pink/20">
        <div className="relative z-10">
          <h3 className="text-2xl font-serif mb-2">Daily Mission</h3>
          <p className="text-white/80 text-sm mb-6">Compliment a stranger today. It builds confidence for both of you.</p>
          <button className="bg-white text-radiant-pink px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-pink-50 transition-colors">
            Accept Mission
          </button>
        </div>
        <Sparkles className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-serif">Your Progress</h3>
          <button className="text-xs font-bold uppercase tracking-widest text-radiant-pink">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
            <span className="text-3xl font-serif text-radiant-pink">{streak}</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Day Streak</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
            <span className="text-3xl font-serif text-radiant-pink">{confidenceScore}%</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Confidence Score</p>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-radiant-pink" size={24} />
          <h3 className="text-xl font-serif">Sanitary Support</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6 italic">Need supplies? Your school is here to help. Talk to your teacher or request anonymously.</p>
        
        {requestStatus === "success" ? (
          <div className="flex items-center justify-center gap-2 text-green-600 font-bold uppercase tracking-widest text-xs py-4">
            <CheckCircle size={16} />
            Request Sent
          </div>
        ) : (
          <button 
            onClick={handleRequestSupplies}
            disabled={requestStatus === "loading"}
            className="w-full py-4 rounded-full border-2 border-dashed border-radiant-pink/30 text-radiant-pink text-xs font-bold uppercase tracking-widest hover:bg-radiant-pink/5 transition-colors disabled:opacity-50"
          >
            {requestStatus === "loading" ? "Sending..." : "Request Supplies"}
          </button>
        )}
      </section>
    </motion.div>
  );
}
