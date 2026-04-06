import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Package } from "lucide-react";
import MoodTracker from "../components/MoodTracker";
import { db, auth, handleFirestoreError, OperationType } from "../lib/firebase";
import { cn } from "../lib/utils";
import RequestForm from "../components/RequestForm";

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
  onboardingData
}: StudentDashboardProps) {

  const needsSupplies =
    onboardingData?.answers?.help_needed === "sanitary_products" ||
    onboardingData?.answers?.help_needed === "clothes" ||
    onboardingData?.answers?.help_needed === "stationery" ||
    onboardingData?.answers?.attendance_barriers === "sanitary_products" ||
    onboardingData?.answers?.attendance_barriers === "clothes" ||
    onboardingData?.answers?.attendance_barriers === "stationery" ||
    onboardingData?.answers?.basic_needs === "no";

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
    </motion.div>
  );
}