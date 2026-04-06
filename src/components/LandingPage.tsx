import { motion } from "motion/react";
import { Sparkles, ArrowRight, Heart, Users, BookOpen, MessageCircle, Clock, ShieldCheck, Package, TrendingUp, GraduationCap, ClipboardList } from "lucide-react";
import { cn } from "../lib/utils";
import Logo from "./Logo";
import { User as FirebaseUser } from "firebase/auth";

interface LandingPageProps {
  onStart: () => void;
  onSafety: () => void;
  onSkip: () => void;
  onLogin: () => void;
  onReset: () => void;
}

export default function LandingPage({ onStart, onSafety, onSkip, onLogin, onReset }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-radiant-bg text-radiant-ink font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 border-b border-black/5 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-radiant-pink transition-colors">Home</a>
          <a href="#mood" className="hover:text-radiant-pink transition-colors">Mood</a>
          <a href="#grow" className="hover:text-radiant-pink transition-colors">Grow</a>
          <a href="#community" className="hover:text-radiant-pink transition-colors">Community</a>
          <a href="#schools" className="hover:text-radiant-pink transition-colors">Schools</a>
          <a href="#partners" className="hover:text-radiant-pink transition-colors">Partners</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="text-sm font-bold text-gray-500 hover:text-radiant-pink transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={onStart}
            className="bg-radiant-pink text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-[0.9] tracking-tight">
            Your safe space <br />
            <span className="italic text-radiant-pink">to grow</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-lg md:text-xl text-gray-600 font-serif italic">
            <span>Discover who you are.</span>
            <span className="hidden md:inline">•</span>
            <span>Grow at your pace.</span>
          </div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Track your moods, build confidence, connect with peers who get it — all in a calm, judgment-free space made for teens.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto bg-radiant-pink text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Sign up
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto bg-white border border-black/5 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Log in
            </button>
          </div>
          <button 
            onClick={onReset}
            className="mt-8 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-radiant-pink transition-colors"
          >
            Trouble logging in? Try resetting the app.
          </button>
        </motion.div>
      </section>

      {/* Mood Section */}
      <section id="mood" className="px-6 py-24 bg-white/40 border-y border-black/5">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-6">How are you feeling today?</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto text-lg leading-relaxed px-4">
            Check in with yourself daily. Over time, you'll see patterns that help you understand what lifts you up and what brings you down.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 px-4">
            {[
              { emoji: "😊", label: "Happy" },
              { emoji: "😌", label: "Calm" },
              { emoji: "😔", label: "Down" },
              { emoji: "😤", label: "Angry" },
              { emoji: "😰", label: "Anxious" },
              { emoji: "🤔", label: "Confused" },
            ].map((mood, index) => (
              <motion.div 
                key={mood.label}
                initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:border-radiant-pink/30 hover:shadow-xl transition-all cursor-pointer group text-center"
              >
                <span className="text-6xl mb-4 block group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500">{mood.emoji}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-radiant-pink transition-colors">{mood.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Grow Section */}
      <section id="grow" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Grow a little every day</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed px-4">
              Bite-sized activities designed by counselors to help you build emotional skills — no pressure, go at your own pace.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-10 px-4">
            {[
              { time: "5 min", title: "Confidence Boost", desc: "Small daily challenges to build self-belief", icon: <Sparkles size={32} /> },
              { time: "3 min", title: "Mindful Moment", desc: "Guided breathing and grounding exercises", icon: <Heart size={32} /> },
              { time: "4 min", title: "Gratitude Check", desc: "Reflect on what's good in your world", icon: <BookOpen size={32} /> },
              { time: "6 min", title: "Boundary Builder", desc: "Learn to say no and protect your energy", icon: <ShieldCheck size={32} /> },
              { time: "3 min", title: "Stress Reset", desc: "Quick techniques to calm your nervous system", icon: <Users size={32} /> },
              { time: "2 min", title: "Morning Intention", desc: "Set your vibe before the day begins", icon: <Clock size={32} /> },
            ].map((item, index) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  damping: 15
                }}
                className="bg-white p-12 rounded-[48px] border border-black/5 shadow-sm flex items-start gap-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="w-20 h-20 bg-radiant-bg rounded-[28px] flex items-center justify-center text-radiant-pink shrink-0 group-hover:bg-radiant-pink group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-radiant-pink mb-3 block">{item.time}</span>
                  <h3 className="text-3xl font-serif mb-4 group-hover:text-radiant-pink transition-colors">{item.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="px-6 py-24 bg-radiant-pink text-white overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">You're not alone in this</h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed px-4">
              Connect anonymously with teens who understand what you're going through. Every conversation is moderated for safety.
            </p>
          </div>
          <div className="grid gap-8 mb-20 px-4">
            {[
              { category: "School Life", title: "How do you deal with exam stress?", time: "2h ago", replies: "23 replies", joined: "14 joined" },
              { category: "Friendships", title: "My best friend is ghosting me and I don't know why", time: "4h ago", replies: "41 replies", joined: "28 joined" },
              { category: "Self-Image", title: "Tips for not comparing yourself to people on social media?", time: "6h ago", replies: "67 replies", joined: "45 joined" },
              { category: "Family", title: "Parents don't understand my career choice", time: "8h ago", replies: "19 replies", joined: "12 joined" },
            ].map((forum, index) => (
              <motion.div 
                key={forum.title}
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="bg-white/10 backdrop-blur-md p-10 rounded-[40px] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 mb-3 block group-hover:text-white/80 transition-colors">{forum.category}</span>
                  <h3 className="text-2xl font-serif group-hover:translate-x-3 transition-transform duration-500">{forum.title}</h3>
                </div>
                <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                  <span className="flex items-center gap-2"><Clock size={14} /> {forum.time}</span>
                  <span>{forum.replies}</span>
                  <span>{forum.joined}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-radiant-pink px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-gray-100 transition-all"
            >
              Browse forums
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle size={18} />
              Anonymous chat
            </motion.button>
          </div>
        </motion.div>
        <Sparkles className="absolute -right-20 -bottom-20 text-white/5 w-96 h-96 rotate-12" />
      </section>

      {/* Library Section */}
      <section id="library" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Learn what school doesn't teach</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed px-4">
              Real talk about mental health, relationships, identity, and navigating life as a teen — written by people who actually get it.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-16 px-4">
            {[
              { category: "Mental Health", title: "Understanding Anxiety — What's Actually Happening in Your Brain", read: "5 min read" },
              { category: "Life Skills", title: "How to Have Hard Conversations Without Shutting Down", read: "4 min read" },
              { category: "Social Issues", title: "Navigating Online Drama — When to Speak Up and When to Log Off", read: "6 min read" },
              { category: "Identity", title: "It's Okay to Not Have It All Figured Out Yet", read: "3 min read" },
            ].map((article, index) => (
              <motion.div 
                key={article.title}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  damping: 20
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] bg-gray-100 rounded-[56px] mb-10 overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-10 left-10 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="bg-white/95 backdrop-blur-sm text-radiant-pink px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] shadow-lg">
                      {article.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-4xl font-serif mb-4 group-hover:text-radiant-pink transition-colors leading-tight px-4">
                  {article.title}
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 px-4">{article.read}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section id="schools" className="px-6 py-24 bg-white/40 border-t border-black/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative order-2 md:order-1"
            >
              <div className="aspect-square bg-radiant-pink/5 rounded-[64px] overflow-hidden border border-black/5 flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform rotate-3">
                    <GraduationCap className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-12 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-8 bg-gray-50 rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform -translate-y-8 -rotate-6">
                    <ClipboardList className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-16 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-10 bg-gray-50 rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform translate-y-4 -rotate-2">
                    <TrendingUp className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-14 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-6 bg-gray-50 rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform -translate-y-4 rotate-6">
                    <Users className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-10 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-12 bg-gray-50 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center border border-black/5 animate-pulse">
                <Heart className="text-radiant-pink" size={32} />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 md:order-2"
            >
              <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
                Empower your <span className="text-radiant-pink italic">students</span>
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                RadiantNess Connect provides schools with the tools to support student well-being and ensure no student is left behind due to a lack of essential supplies.
              </p>
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-radiant-pink/10 flex items-center justify-center text-radiant-pink shrink-0">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">Request Supplies</h4>
                    <p className="text-sm text-gray-500">Easily request bulk sanitary products for your school community.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-radiant-pink/10 flex items-center justify-center text-radiant-pink shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">Well-being Analytics</h4>
                    <p className="text-sm text-gray-500">Monitor anonymous student mood trends to provide proactive support.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-radiant-pink/10 flex items-center justify-center text-radiant-pink shrink-0">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">Educational Resources</h4>
                    <p className="text-sm text-gray-500">Access a library of content designed to build student confidence.</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={onLogin}
                className="bg-radiant-pink text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                School Sign In
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="px-6 py-24 bg-white/40 border-t border-black/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
                Partner with <span className="text-radiant-pink italic">purpose</span>
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Join our mission to support disadvantaged youth. Whether you're an NGO providing essential supplies or a business looking to make a social impact, RadiantNess Connect provides the bridge.
              </p>
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-radiant-pink/10 flex items-center justify-center text-radiant-pink shrink-0">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">Supply Distribution</h4>
                    <p className="text-sm text-gray-500">Directly fulfill requests for sanitary products from schools in need.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-radiant-pink/10 flex items-center justify-center text-radiant-pink shrink-0">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">Emotional Support</h4>
                    <p className="text-sm text-gray-500">Provide resources and mentorship to help build student confidence.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-radiant-pink/10 flex items-center justify-center text-radiant-pink shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">Impact Tracking</h4>
                    <p className="text-sm text-gray-500">Real-time analytics to see exactly how your contributions are helping.</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={onLogin}
                className="bg-radiant-pink text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Partner Sign In
                <ArrowRight size={18} />
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-square bg-radiant-pink/5 rounded-[64px] overflow-hidden border border-black/5 flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform -rotate-3">
                    <Users className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-12 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-8 bg-gray-50 rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform translate-y-8 rotate-6">
                    <Package className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-16 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-10 bg-gray-50 rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform -translate-y-4 rotate-2">
                    <Heart className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-14 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-6 bg-gray-50 rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 transform translate-y-4 -rotate-6">
                    <TrendingUp className="text-radiant-pink mb-4" size={32} />
                    <div className="h-2 w-10 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-12 bg-gray-50 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center border border-black/5 animate-bounce">
                <Sparkles className="text-radiant-pink" size={32} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-black/5 bg-white/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <Logo iconSize={24} textSize="text-2xl" />
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-radiant-pink transition-colors">About</a>
            <a href="#schools" className="hover:text-radiant-pink transition-colors">Schools</a>
            <a href="#partners" className="hover:text-radiant-pink transition-colors">Partners</a>
            <button 
              onClick={onSafety}
              className="hover:text-radiant-pink transition-colors cursor-pointer"
            >
              Safety & Privacy
            </button>
            <a href="#" className="hover:text-radiant-pink transition-colors">Help</a>
          </div>
        </div>
        <div className="mt-20 text-center text-[10px] font-bold uppercase tracking-widest text-gray-300">
          © 2026 RadiantNess. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
