import { motion } from "motion/react";
import { Home, MessageSquare, BookOpen, Users, Heart, Settings } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: string | null;
}

export default function Navigation({ activeTab, setActiveTab, role }: NavigationProps) {
  const getTabs = () => {
    const baseTabs = [
      { id: "dashboard", icon: Home, label: "Home" },
      { id: "community", icon: Users, label: "Community" },
    ];

    if (role === "student") {
      return [
        ...baseTabs,
        { id: "journal", icon: BookOpen, label: "Journal" },
        { id: "topics", icon: Heart, label: "Topics" },
      ];
    }

    if (role === "teacher_parent") {
      return [
        ...baseTabs,
        { id: "topics", icon: Heart, label: "Resources" },
      ];
    }

    if (role === "ngo_requester") {
      return [
        ...baseTabs,
        { id: "topics", icon: Heart, label: "Impact" },
      ];
    }

    if (role === "admin") {
      return [
        ...baseTabs,
        { id: "settings", icon: Settings, label: "Admin" },
      ];
    }

    return baseTabs;
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-black/5 px-6 py-3 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors relative",
              activeTab === tab.id ? "text-radiant-pink" : "text-gray-400"
            )}
          >
            <tab.icon size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 bg-radiant-pink rounded-full"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
