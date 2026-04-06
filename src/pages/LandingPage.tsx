import { motion } from "motion/react";
import { 
  Sparkles, Heart, Shield, Users, ArrowRight, CheckCircle, Package, 
  Building2, School, HeartHandshake, MessageCircle, BookOpen, 
  Clock, Smile, Cloud, Zap, Brain, Target, Sun, Moon
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-radiant-accent/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-radiant-pink rounded-lg flex items-center justify-center shadow-lg shadow-radiant-pink/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">RadiantNess</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#mood" className="hover:text-radiant-accent transition-colors">Mood</a>
            <a href="#grow" className="hover:text-radiant-accent transition-colors">Grow</a>
            <a href="#community" className="hover:text-radiant-accent transition-colors">Community</a>
            <a href="#learn" className="hover:text-radiant-accent transition-colors">Learn</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            x: ["-50%", "-48%", "-50%"],
            y: ["0%", "2%", "0%"]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-radiant-accent/20 blur-[120px] rounded-full -z-10" 
        />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]"
            >
              Your safe space <br />
              <span className="text-radiant-pink italic">to grow.</span>
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6"
            >
              Discover who you are. Grow at your pace.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Track your moods, build confidence, connect with peers who get it — all in a calm, judgment-free space made for teens.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-radiant-pink text-white rounded-2xl font-semibold text-lg shadow-xl shadow-radiant-pink/20 hover:bg-radiant-pink/90 transition-all flex items-center justify-center gap-2 group"
              >
                Start now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all"
              >
                Explore topics
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mood Section */}
      <section id="mood" className="py-20 bg-radiant-accent/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              How are you feeling today?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-gray-600 mb-12 leading-relaxed"
            >
              Check in with yourself daily. Over time, you'll see patterns that help you understand what lifts you up and what brings you down.
            </motion.p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { emoji: "😊", label: "Happy" },
                { emoji: "😌", label: "Calm" },
                { emoji: "😔", label: "Down" },
                { emoji: "😤", label: "Angry" },
                { emoji: "😰", label: "Anxious" },
                { emoji: "🤔", label: "Confused" }
              ].map((mood, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-radiant-accent/30 transition-all group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-600">{mood.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="grow" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Grow a little every day
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Bite-sized activities designed by counselors to help you build emotional skills — no pressure, go at your own pace.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                time: "5 min",
                title: "Confidence Boost",
                description: "Small daily challenges to build self-belief",
                icon: <Zap className="w-5 h-5" />
              },
              {
                time: "3 min",
                title: "Mindful Moment",
                description: "Guided breathing and grounding exercises",
                icon: <Cloud className="w-5 h-5" />
              },
              {
                time: "4 min",
                title: "Gratitude Check",
                description: "Reflect on what's good in your world",
                icon: <Heart className="w-5 h-5" />
              },
              {
                time: "6 min",
                title: "Boundary Builder",
                description: "Learn to say no and protect your energy",
                icon: <Shield className="w-5 h-5" />
              },
              {
                time: "3 min",
                title: "Stress Reset",
                description: "Quick techniques to calm your nervous system",
                icon: <Brain className="w-5 h-5" />
              },
              {
                time: "2 min",
                title: "Morning Intention",
                description: "Set your vibe before the day begins",
                icon: <Sun className="w-5 h-5" />
              }
            ].map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="p-8 bg-gray-50 rounded-[2rem] border border-transparent hover:border-radiant-accent/20 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-radiant-pink shadow-sm group-hover:bg-radiant-pink group-hover:text-white transition-all">
                    {activity.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">
                    {activity.time}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                <p className="text-gray-600 leading-relaxed">{activity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-radiant-pink/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
              >
                You're not alone <br />
                <span className="text-radiant-pink">in this.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-gray-400 text-lg mb-10 leading-relaxed"
              >
                Connect anonymously with teens who understand what you're going through. Every conversation is moderated for safety.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-4"
              >
                <button onClick={onGetStarted} className="px-8 py-4 bg-radiant-pink text-white rounded-2xl font-bold hover:bg-radiant-pink/90 transition-all flex items-center gap-2">
                  Browse forums <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={onGetStarted} className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all">
                  Anonymous chat
                </button>
              </motion.div>
            </div>
            <div className="space-y-4">
              {[
                { category: "School Life", title: "How do you deal with exam stress?", time: "2h ago", replies: 23, joined: 14 },
                { category: "Friendships", title: "My best friend is ghosting me and I don't know why", time: "4h ago", replies: 41, joined: 28 },
                { category: "Self-Image", title: "Tips for not comparing yourself to people on social media?", time: "6h ago", replies: 67, joined: 45 },
                { category: "Family", title: "Parents don't understand my career choice", time: "8h ago", replies: 19, joined: 12 }
              ].map((post, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-radiant-accent uppercase tracking-wider">{post.category}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-xs text-gray-500">{post.time}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-4 group-hover:text-radiant-accent transition-colors">{post.title}</h3>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> {post.replies} replies
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> {post.joined} joined
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section */}
      <section id="learn" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Learn what school doesn't teach
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Real talk about mental health, relationships, identity, and navigating life as a teen — written by people who actually get it.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: "Mental Health",
                title: "Understanding Anxiety — What's Actually Happening in Your Brain",
                read: "5 min read"
              },
              {
                category: "Life Skills",
                title: "How to Have Hard Conversations Without Shutting Down",
                read: "4 min read"
              },
              {
                category: "Social Issues",
                title: "Navigating Online Drama — When to Speak Up and When to Log Off",
                read: "6 min read"
              },
              {
                category: "Identity",
                title: "It's Okay to Not Have It All Figured Out Yet",
                read: "3 min read"
              }
            ].map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col p-6 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl hover:border-radiant-accent/20 border border-transparent transition-all cursor-pointer group"
              >
                <span className="text-xs font-bold text-radiant-accent uppercase mb-4">{article.category}</span>
                <h3 className="text-lg font-bold mb-auto leading-snug group-hover:text-radiant-accent transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-6">
                  <Clock className="w-4 h-4" /> {article.read}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders Section (NGOs, Schools, Parents) */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-radiant-pink/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Our Ecosystem
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Connecting stakeholders to create a sustainable support network for every girl.
            </motion.p>
          </div>
          
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* NGOs & Businesses */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-radiant-pink/30 hover:bg-white/10 hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-8 md:gap-12"
            >
              <div className="w-20 h-20 shrink-0 bg-radiant-pink text-white rounded-3xl flex items-center justify-center shadow-lg shadow-radiant-pink/20">
                <Building2 className="w-10 h-10" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">NGOs & Businesses</h3>
                <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                  Partner with us to provide essential supplies. Your contributions directly support girls in need through our verified network of schools and community centers.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                  {["Direct supply donations", "Corporate sponsorship", "Verified impact tracking"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <CheckCircle className="w-4 h-4 text-radiant-pink" />
                      {item}
                    </div>
                  ))}
                </div>
                <button onClick={onGetStarted} className="w-full md:w-auto px-10 py-4 bg-radiant-pink text-white rounded-2xl font-bold hover:bg-radiant-pink/90 transition-all shadow-lg shadow-radiant-pink/10">
                  Partner With Us
                </button>
              </div>
            </motion.div>

            {/* Schools */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-radiant-pink/30 hover:bg-white/10 hover:shadow-xl transition-all flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12"
            >
              <div className="w-20 h-20 shrink-0 bg-radiant-pink text-white rounded-3xl flex items-center justify-center shadow-lg shadow-radiant-pink/20">
                <School className="w-10 h-10" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Schools</h3>
                <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                  Ensure your students have what they need to succeed. Request sanitary products and other essentials directly through your dedicated school dashboard.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                  {["Request supplies easily", "Inventory management", "Student well-being tracking"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <CheckCircle className="w-4 h-4 text-radiant-pink" />
                      {item}
                    </div>
                  ))}
                </div>
                <button onClick={onGetStarted} className="w-full md:w-auto px-10 py-4 bg-radiant-pink text-white rounded-2xl font-bold hover:bg-radiant-pink/90 transition-all shadow-lg shadow-radiant-pink/10">
                  Register Your School
                </button>
              </div>
            </motion.div>

            {/* Parents */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-radiant-pink/30 hover:bg-white/10 hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-8 md:gap-12"
            >
              <div className="w-20 h-20 shrink-0 bg-radiant-pink text-white rounded-3xl flex items-center justify-center shadow-lg shadow-radiant-pink/20">
                <HeartHandshake className="w-10 h-10" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Parents</h3>
                <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                  Stay informed about your child's health and well-being. Access educational resources and track supply requests to ensure a smooth school experience.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                  {["Health resources", "Request monitoring", "Direct support channel"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <CheckCircle className="w-4 h-4 text-radiant-pink" />
                      {item}
                    </div>
                  ))}
                </div>
                <button onClick={onGetStarted} className="w-full md:w-auto px-10 py-4 bg-radiant-pink text-white rounded-2xl font-bold hover:bg-radiant-pink/90 transition-all shadow-lg shadow-radiant-pink/10">
                  Join As A Parent
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-20 border-t border-gray-100 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-radiant-pink rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">RadiantNess</span>
              </div>
              <p className="text-gray-500 max-w-xs">
                Empowering the next generation with tools for emotional growth and health.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="flex flex-col gap-4">
                <span className="font-bold text-gray-900 uppercase text-xs tracking-widest">App</span>
                <a href="#" className="text-gray-500 hover:text-radiant-accent transition-colors">About</a>
                <a href="#" className="text-gray-500 hover:text-radiant-accent transition-colors">Safety</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-gray-900 uppercase text-xs tracking-widest">Legal</span>
                <a href="#" className="text-gray-500 hover:text-radiant-accent transition-colors">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-radiant-accent transition-colors">Terms</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-gray-900 uppercase text-xs tracking-widest">Support</span>
                <a href="#" className="text-gray-500 hover:text-radiant-accent transition-colors">Help</a>
                <a href="#" className="text-gray-500 hover:text-radiant-accent transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500">© 2026 RadiantNess. All rights reserved.</p>
            <div className="flex gap-6">
              <div className="w-5 h-5 bg-gray-100 rounded-full" />
              <div className="w-5 h-5 bg-gray-100 rounded-full" />
              <div className="w-5 h-5 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
