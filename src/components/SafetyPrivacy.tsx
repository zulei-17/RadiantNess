import { motion } from "motion/react";
import { ArrowLeft, Shield, Lock, Eye, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SafetyPrivacyProps {
  onBack: () => void;
}

export default function SafetyPrivacy({ onBack }: SafetyPrivacyProps) {
  return (
    <div className="min-h-screen bg-radiant-bg text-radiant-ink font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-radiant-pink transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Back to home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <header>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">Safety & Privacy</h1>
            <p className="text-xl text-gray-500 leading-relaxed font-serif italic">
              At RadiantNess, your safety and privacy come first. Here’s how we protect you and your data.
            </p>
          </header>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-radiant-pink">
              <div className="w-12 h-12 bg-radiant-pink/10 rounded-2xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-3xl font-serif">How We Collect Data</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
                <h3 className="text-xl font-serif mb-4 text-radiant-pink">Mood & Activity Data</h3>
                <ul className="space-y-3 text-gray-500 text-sm leading-relaxed list-disc pl-4">
                  <li>If you log your feelings or daily activities, this data is stored locally on your device.</li>
                  <li>This helps you track growth over time and receive personalized activity suggestions.</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
                <h3 className="text-xl font-serif mb-4 text-radiant-pink">Optional Account Info</h3>
                <ul className="space-y-3 text-gray-500 text-sm leading-relaxed list-disc pl-4">
                  <li>If you create an account for syncing data across devices, we collect only what you voluntarily provide (like a username or email).</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm md:col-span-2">
                <h3 className="text-xl font-serif mb-4 text-radiant-pink">Community Contributions</h3>
                <ul className="space-y-3 text-gray-500 text-sm leading-relaxed list-disc pl-4">
                  <li>Posts, comments, or messages in the forum are stored anonymously unless you choose to reveal your username.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-radiant-pink">
              <div className="w-12 h-12 bg-radiant-pink/10 rounded-2xl flex items-center justify-center">
                <Eye size={24} />
              </div>
              <h2 className="text-3xl font-serif">Cookies & Tracking</h2>
            </div>
            <div className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm space-y-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">Functional Cookies</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Keep you logged in and remember your preferences and theme settings.</p>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-4">Performance Cookies</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Help us understand which parts of the app are most popular without tracking your identity.</p>
                </div>
              </div>
              <div className="pt-8 border-t border-black/5">
                <h4 className="text-xl font-serif mb-4 text-radiant-pink">No Third-Party Selling</h4>
                <p className="text-gray-500 text-sm leading-relaxed">We never sell your data to advertisers. Data is only used to make your experience safer and better.</p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-radiant-accent">
              <div className="w-12 h-12 bg-radiant-accent/10 rounded-2xl flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h2 className="text-3xl font-serif">Your Rights & Safety</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "You can delete your mood/activity logs at any time.",
                "You can leave the community or hide your profile whenever you want.",
                "All chat forums are monitored for safety and inappropriate content.",
                "For serious concerns, our app connects you to trained counsellors."
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm flex items-start gap-4">
                  <div className="w-2 h-2 bg-radiant-accent rounded-full mt-2 shrink-0" />
                  <p className="text-sm text-gray-500 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-radiant-pink text-white p-12 rounded-[48px] relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <Info size={24} />
                <h2 className="text-3xl font-serif">Tips for Safe App Use</h2>
              </div>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  Keep your account info private
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  Do not share personal details in the forum
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  Report unsafe content using the report buttons
                </li>
              </ul>
            </div>
            <Shield className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
          </section>

          <footer className="text-center py-12 border-t border-black/5">
            <h3 className="text-2xl font-serif mb-4">Summary</h3>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              RadiantNess is designed to be safe, private, and teen-friendly. Your growth, learning, and safety are our top priorities.
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
