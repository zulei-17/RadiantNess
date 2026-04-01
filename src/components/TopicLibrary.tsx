import { useState } from "react";
import { Search, BookOpen, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const TOPICS = [
  { id: "1", title: "Building Self-Confidence", category: "Mindset", content: "Self-confidence is a skill, not a trait. Start by celebrating small wins every day. Confidence comes from competence—the more you practice, the better you feel.", tags: ["confidence", "growth"] },
  { id: "2", title: "Managing Social Anxiety", category: "Mental Health", content: "Social anxiety is common. Try the 5-4-3-2-1 grounding technique when you feel overwhelmed: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you can taste.", tags: ["anxiety", "social"] },
  { id: "3", title: "The Power of Saying No", category: "Boundaries", content: "Setting boundaries is an act of self-love. You don't have to please everyone. Saying no to others often means saying yes to your own well-being.", tags: ["boundaries", "respect"] },
  { id: "4", title: "Digital Detox Tips", category: "Lifestyle", content: "Your worth isn't measured by likes. Try turning off notifications for an hour today. Spend that time doing something offline that makes you happy.", tags: ["digital", "focus"] },
  { id: "5", title: "Finding Your Passion", category: "Growth", content: "Passion is often found through curiosity. What's one thing you've always wanted to try? Don't wait for a 'calling'—just start exploring.", tags: ["passion", "purpose"] },
  { id: "6", title: "Coping with Loneliness", category: "Community", content: "Loneliness is a feeling, not a permanent state. Reach out to one person today, even if it's just a quick text. Connection starts with a small step.", tags: ["loneliness", "connection"] },
  { id: "7", title: "Overcoming Perfectionism", category: "Mindset", content: "Perfection is an illusion that prevents progress. Aim for 'good enough' and focus on the learning process rather than the final result.", tags: ["perfectionism", "growth"] },
  { id: "8", title: "Healthy Sleep Habits", category: "Lifestyle", content: "Sleep is the foundation of mental health. Try to keep a consistent sleep schedule and avoid screens 30 minutes before bed.", tags: ["sleep", "health"] },
  { id: "9", title: "Dealing with Peer Pressure", category: "Social", content: "True friends respect your choices. If you feel pressured to do something that doesn't align with your values, it's okay to walk away.", tags: ["friends", "values"] },
  { id: "10", title: "Practicing Gratitude", category: "Mindset", content: "Gratitude rewires your brain for positivity. Write down three things you're thankful for every night before you go to sleep.", tags: ["gratitude", "happiness"] },
];

export default function TopicLibrary() {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<typeof TOPICS[0] | null>(null);

  const filteredTopics = TOPICS.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics (e.g. Confidence, Anxiety...)"
          className="w-full bg-white rounded-full py-4 pl-12 pr-6 shadow-sm border border-black/5 focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
        />
      </div>

      <div className="grid gap-4">
        {filteredTopics.map((topic) => (
          <motion.button
            key={topic.id}
            layoutId={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className="bg-white p-6 rounded-[24px] text-left shadow-sm border border-black/5 flex items-center justify-between group hover:border-radiant-pink/30 transition-colors"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-radiant-pink/60 mb-1 block">
                {topic.category}
              </span>
              <h4 className="text-lg font-serif">{topic.title}</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-radiant-bg flex items-center justify-center group-hover:bg-radiant-pink group-hover:text-white transition-colors">
              <ChevronRight size={20} />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setSelectedTopic(null)}
          >
            <motion.div
              layoutId={selectedTopic.id}
              className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-radiant-pink" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-radiant-pink mb-2 block">
                {selectedTopic.category}
              </span>
              <h3 className="text-3xl font-serif mb-6">{selectedTopic.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                {selectedTopic.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedTopic.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-radiant-bg rounded-full text-[10px] font-bold uppercase tracking-wider text-radiant-pink">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="w-full bg-radiant-pink text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
