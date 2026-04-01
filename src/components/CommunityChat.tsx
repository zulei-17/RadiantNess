import { useState, useEffect, useRef } from "react";
import { Send, Users, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { ChatMessage } from "@/src/types";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

export default function CommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "community_chat"),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as ChatMessage[];
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "community_chat");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser || isSending) return;
    
    setIsSending(true);
    const text = input;
    setInput("");

    try {
      // Generate a random anonymous name and color if not already set
      const anonymousName = `Radiant ${Math.floor(Math.random() * 1000)}`;
      const colors = ["#d682bd", "#7c4dff", "#ea80fc", "#f06292", "#ff80ab"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      await addDoc(collection(db, "community_chat"), {
        text,
        author: anonymousName,
        color: randomColor,
        timestamp: serverTimestamp(),
        uid: auth.currentUser.uid
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "community_chat");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[32px] shadow-sm border border-black/5 overflow-hidden">
      <div className="p-6 border-bottom border-black/5 flex items-center justify-between bg-radiant-pink text-white">
        <div className="flex items-center gap-3">
          <Users size={20} />
          <div>
            <h3 className="font-serif text-lg">Anonymous Community</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Safe Space for Sharing</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Moderated</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-radiant-bg/30">
        <div className="text-center mb-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest bg-white/50 inline-block px-4 py-1 rounded-full">
            Welcome to the safe zone. Be kind.
          </p>
        </div>
        
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: msg.color }} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{msg.author}</span>
                <span className="text-[10px] text-gray-300">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm text-sm text-radiant-ink border border-black/5 max-w-[90%]">
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t border-black/5">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Share your experience anonymously..."
            className="w-full bg-radiant-bg rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-radiant-pink/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-2 w-10 h-10 bg-radiant-pink text-white rounded-full flex items-center justify-center transition-transform active:scale-90 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
