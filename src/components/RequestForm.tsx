import { useState } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Package, Send, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface RequestFormProps {
  user: any;
}

export default function RequestForm({ user }: RequestFormProps) {
  const [type, setType] = useState("sanitary");
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState("normal");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async () => {
    if (!user?.uid) return;
    setStatus("loading");
    
    try {
      await addDoc(collection(db, "requests"), {
        studentId: user.uid,
        parentId: user.role === "parent" ? user.uid : null,
        type,
        quantity: Number(quantity),
        urgency,
        status: "pending",
        location: user.location || "Unknown",
        createdAt: serverTimestamp()
      });

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "requests");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <Send size={32} />
        </div>
        <h4 className="text-lg font-serif text-gray-900 mb-1">Request Sent!</h4>
        <p className="text-sm text-gray-500">Your school will be notified shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
            Item Type
          </label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-radiant-pink/20 transition-all"
          >
            <option value="sanitary">Sanitary Products</option>
            <option value="uniform">Uniform / Clothes</option>
            <option value="stationery">Stationery / Books</option>
            <option value="other">Other Support</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-radiant-pink/20 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
          Urgency
        </label>
        <div className="flex gap-2">
          {["normal", "urgent"].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUrgency(u)}
              className={cn(
                "flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all",
                urgency === u 
                  ? "bg-radiant-pink text-white border-radiant-pink shadow-md shadow-radiant-pink/20" 
                  : "bg-white text-gray-400 border-black/5 hover:border-radiant-pink/30"
              )}
            >
              {u === "normal" ? "Can Wait" : "Need Soon"}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="w-full py-4 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
      >
        {status === "loading" ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Submit Request <Send size={14} />
          </>
        )}
      </button>

      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-2xl text-[10px] text-blue-600 font-medium">
        <AlertCircle size={14} />
        <span>Your request is shared with your school's support team.</span>
      </div>
    </div>
  );
}
