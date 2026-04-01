import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Bell, User, Settings, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "./lib/utils";
import Navigation from "./components/Navigation";
import MoodTracker from "./components/MoodTracker";
import AIChat from "./components/AIChat";
import CommunityChat from "./components/CommunityChat";
import TopicLibrary from "./components/TopicLibrary";
import LandingPage from "./components/LandingPage";
import OnboardingQuiz from "./components/OnboardingQuiz";
import SafetyPrivacy from "./components/SafetyPrivacy";
import RoleSelection from "./components/RoleSelection";
import StudentDashboard from "./components/dashboards/StudentDashboard";
import TeacherDashboard from "./components/dashboards/TeacherDashboard";
import NGODashboard from "./components/dashboards/NGODashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from "./lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [view, setView] = useState<"landing" | "onboarding" | "app" | "safety" | "role-selection">("landing");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("Radiant");
  const [streak, setStreak] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");

      if (currentUser) {
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.displayName || "Radiant");
            setStreak(data.streak || 0);
            setConfidenceScore(data.confidenceScore || 0);
            setUserRole(data.userRole || null);
            
            // Only auto-redirect to app if they've already seen the landing page in this session
            if (hasSeenLanding) {
              if (!data.userRole) {
                setView("role-selection");
              } else {
                setView("app");
              }
            } else {
              setView("landing");
            }
          } else {
            // New user, but we still want them to see landing first if they haven't
            if (hasSeenLanding) {
              setView("role-selection");
            } else {
              setView("landing");
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          setView("landing");
        }
      } else {
        setView("landing");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStartJourney = () => {
    sessionStorage.setItem("hasSeenLanding", "true");
    // Go to role selection first to determine if they need onboarding
    setView("role-selection");
  };

  const handleSkipLanding = () => {
    sessionStorage.setItem("hasSeenLanding", "true");
    setView("app");
  };

  const handleSkipOnboarding = async () => {
    if (user) {
      try {
        const userData = {
          uid: user.uid,
          displayName: user.displayName || "Radiant",
          streak: 0,
          confidenceScore: 0,
          userRole: "student",
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", user.uid), userData);
        setUserName(userData.displayName);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
    setView("app");
  };

  // Real-time sync for user stats
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setStreak(data.streak || 0);
        setConfidenceScore(data.confidenceScore || 0);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRoleSelect = async (role: "student" | "teacher_parent" | "ngo_requester") => {
    if (!user) {
      // If not logged in, we trigger login first
      handleLogin();
      return;
    }
    
    setUserRole(role);
    
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), { userRole: role }, { merge: true });
        setView("app");
      } else {
        // New user
        if (role === "student") {
          setView("onboarding");
        } else {
          // For non-students, skip onboarding and create doc immediately
          const userData = {
            uid: user.uid,
            displayName: user.displayName || "Radiant",
            streak: 0,
            confidenceScore: 0,
            userRole: role,
            createdAt: serverTimestamp(),
          };
          await setDoc(doc(db, "users", user.uid), userData);
          setUserName(userData.displayName);
          setView("app");
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    if (!user) return;

    try {
      const userData = {
        uid: user.uid,
        displayName: data.name || user.displayName || "Radiant",
        streak: 0,
        confidenceScore: 0,
        userRole: "student", // Onboarding is now student-exclusive
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);
      setUserName(userData.displayName);
      setStreak(0);
      setConfidenceScore(0);
      setView("app");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleLogin = async () => {
    try {
      sessionStorage.setItem("hasSeenLanding", "true");
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("hasSeenLanding");
      await logout();
      setView("landing");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-radiant-bg flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-radiant-pink border-t-transparent rounded-full"
          />
        </div>
      );
    }

    if (view === "landing") {
      return (
        <LandingPage 
          onStart={handleStartJourney} 
          onSafety={() => setView("safety")}
          onSkip={handleSkipLanding}
          onLogin={handleLogin}
          user={user}
        />
      );
    }

    if (view === "safety") {
      return <SafetyPrivacy onBack={() => setView("landing")} />;
    }

    if (view === "onboarding") {
      return (
        <OnboardingQuiz 
          onComplete={handleOnboardingComplete} 
          onSkip={handleSkipOnboarding} 
          onBack={() => setView("role-selection")}
        />
      );
    }

    if (view === "role-selection") {
      return <RoleSelection onSelect={handleRoleSelect} onBack={() => setView("landing")} />;
    }

    const renderAppContent = () => {
      switch (activeTab) {
        case "dashboard":
          if (userRole === "student") {
            return <StudentDashboard userName={userName} streak={streak} confidenceScore={confidenceScore} />;
          }
          if (userRole === "teacher_parent") {
            return <TeacherDashboard />;
          }
          if (userRole === "ngo_requester") {
            return <NGODashboard />;
          }
          if (userRole === "admin") {
            return <AdminDashboard />;
          }
          return (
            <div className="space-y-8">
              <header>
                <h1 className="text-4xl font-serif">Hello, {userName}.</h1>
                <p className="text-gray-500 text-sm italic">Ready to shine today?</p>
              </header>
            </div>
          );
        case "journal":
          return <AIChat />;
        case "topics":
          return <TopicLibrary />;
        case "community":
          return <CommunityChat />;
        default:
          return null;
      }
    };

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (activeTab === "dashboard") {
                setView("role-selection");
              } else {
                setActiveTab("dashboard");
              }
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-radiant-pink transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            {activeTab === "dashboard" ? "Back to Role Selection" : "Back to Dashboard"}
          </button>
          
          {activeTab === "dashboard" && (
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center text-gray-400">
                <Bell size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center text-gray-400 hover:text-radiant-pink transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderAppContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen bg-radiant-bg", view === "app" && "pb-32")}>
      <div className={cn(view === "app" ? "max-w-2xl mx-auto px-6 pt-12" : "w-full")}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
      {view === "app" && <Navigation activeTab={activeTab} setActiveTab={setActiveTab} role={userRole} />}
    </div>
  );
}
