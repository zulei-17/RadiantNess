import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function AIChat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi there! I'm your RadiantNess assistant. How are you feeling today? I'm here to listen and help you explore your thoughts." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are a supportive, empathetic AI assistant for a teen wellness app called RadiantNess. Your goal is to help users explore their emotions, build confidence, and provide gentle guidance. Keep responses concise, warm, and non-judgmental. If a user mentions self-harm, provide resources and encourage them to talk to a trusted adult.",
        }
      });

      setMessages(prev => [...prev, { role: "ai", text: response.text || "I'm here for you. Tell me more." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "ai", text: "I'm having a little trouble connecting, but I'm still listening. What's on your mind?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[32px] shadow-sm border border-black/5 overflow-hidden">
      <div className="p-6 border-bottom border-black/5 flex items-center gap-3 bg-radiant-pink text-white">
        <Sparkles size={20} />
        <div>
          <h3 className="font-serif text-lg">AI Journal Assistant</h3>
          <p className="text-[10px] uppercase tracking-widest opacity-70">Private & Supportive</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-radiant-bg/30">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user" ? "bg-radiant-accent text-white" : "bg-radiant-pink text-white"
              )}>
                {msg.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === "user" ? "bg-radiant-accent text-white rounded-tr-none" : "bg-white text-radiant-ink shadow-sm rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-radiant-pink text-white flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t border-black/5">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write your thoughts..."
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
