import { useState } from "react";
import { motion } from "motion/react";
import { Smile, Meh, Frown, Heart, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Mood } from "@/src/types";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const moods: { type: Mood; icon: any; label: string; color: string }[] = [
    { type: "great", icon: Star, label: "Great", color: "text-yellow-500" },
    { type: "good", icon: Smile, label: "Good", color: "text-green-500" },
    { type: "okay", icon: Meh, label: "Okay", color: "text-blue-500" },
    { type: "low", icon: Frown, label: "Low", color: "text-orange-500" },
    { type: "bad", icon: Heart, label: "Bad", color: "text-red-500" },
  ];

  const handleMoodSelect = async (mood: Mood) => {
    if (!auth.currentUser || isSaving) return;
    
    setSelectedMood(mood);
    setIsSaving(true);

    try {
      const userId = auth.currentUser.uid;
      const moodLog = {
        uid: userId,
        mood: mood,
        timestamp: serverTimestamp(),
      };

      // Save mood log
      await addDoc(collection(db, "users", userId, "moods"), moodLog);

      // Update streak and confidence score
      // For simplicity, we increment streak on every mood log for now
      // In a real app, you'd check if it's a new day
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          streak: increment(1),
          confidenceScore: increment(2), // Small boost for checking in
          lastCheckIn: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/moods`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
      <h3 className="text-2xl font-serif mb-6">How are you feeling today?</h3>
      <div className="flex justify-between items-center gap-2">
        {moods.map((mood) => (
          <button
            key={mood.type}
            onClick={() => handleMoodSelect(mood.type)}
            disabled={isSaving}
            className={cn(
              "flex flex-col items-center gap-3 transition-all duration-300",
              selectedMood === mood.type ? "scale-110" : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0",
              isSaving && "cursor-not-allowed"
            )}
          >
            <div className={cn("p-4 rounded-full bg-radiant-bg", selectedMood === mood.type && "bg-white shadow-md")}>
              <mood.icon size={32} className={mood.color} />
            </div>
            <span className="text-xs font-medium uppercase tracking-tighter">{mood.label}</span>
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-radiant-bg rounded-2xl text-sm italic text-center text-radiant-pink"
        >
          "It's okay to feel {selectedMood}. Remember, every emotion is a step toward self-awareness."
        </motion.div>
      )}
    </div>
  );
}
