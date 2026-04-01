import { motion } from "motion/react";
import { User, GraduationCap, Users, HeartHandshake, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

interface RoleSelectionProps {
  onSelect: (role: "student" | "teacher_parent" | "ngo_requester") => void;
  onBack: () => void;
}

export default function RoleSelection({ onSelect, onBack }: RoleSelectionProps) {
  const roles = [
    {
      id: "student",
      title: "Student",
      description: "I'm here to grow my confidence and learn.",
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "teacher_parent",
      title: "Teacher / Parent",
      description: "I want to support and guide others.",
      icon: Users,
      color: "bg-orange-50 text-orange-600",
    },
    {
      id: "ngo_requester",
      title: "NGO / Requester",
      description: "I'm looking to collaborate or participate.",
      icon: HeartHandshake,
      color: "bg-purple-50 text-purple-600",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-radiant-bg flex items-center justify-center p-6 relative">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 p-3 text-gray-400 hover:text-radiant-pink transition-colors bg-white rounded-full shadow-sm border border-black/5"
      >
        <ArrowLeft size={20} />
      </button>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <header>
          <h1 className="text-4xl font-serif mb-2">Welcome to RadiantNess</h1>
          <p className="text-gray-500 italic">Tell us a bit about yourself to personalize your experience.</p>
        </header>

        <div className="grid gap-4">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(role.id)}
              className={cn(
                "group flex items-center gap-4 p-6 bg-white rounded-[24px] border border-black/5 shadow-sm",
                "hover:border-radiant-pink hover:shadow-md transition-all text-left w-full"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", role.color)}>
                <role.icon size={24} />
              </div>
              <div>
                <h3 className="font-serif text-lg group-hover:text-radiant-pink transition-colors">{role.title}</h3>
                <p className="text-sm text-gray-400 leading-tight">{role.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          You can change this later in settings
        </p>
      </motion.div>
    </div>
  );
}
