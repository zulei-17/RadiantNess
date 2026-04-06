import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import LandingPage from "./pages/LandingPage";
import RoleSelector from "./auth/RoleSelector";
import StudentDashboard from "./dashboards/StudentDashboard";
import ParentDashboard from "./dashboards/ParentDashboard";
import SchoolDashboard from "./dashboards/SchoolDashboard";
import NGODashboard from "./dashboards/NGODashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

// 🔥 ADD THESE
import StudentOnboarding from "./onboarding/StudentOnboarding";
import ParentOnboarding from "./onboarding/ParentOnboarding";
import SchoolOnboarding from "./onboarding/SchoolOnboarding";
import NGOOnboarding from "./onboarding/NGOOnboarding";

import { auth, db, signInWithGoogle } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();

          setUser({
            ...firebaseUser,
            ...data,
            role: data.userRole || null
          });

          setShowRoleSelector(!data.userRole);
        } else {
          setUser(firebaseUser);
          setShowRoleSelector(true);
        }
      } else {
        setUser(null);
        setShowRoleSelector(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    setHasStarted(true);
  };

  // 🔥 NEW: finish onboarding → THEN login
  const handleFinishOnboarding = async (answers: any) => {
    try {
      await signInWithGoogle();

      if (auth.currentUser && selectedRole) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            userRole: selectedRole,
            onboardingData: answers, // 🔥 THIS IS KEY
            createdAt: serverTimestamp(),
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔄 Loading
  if (loading) return <div>Loading...</div>;

  const normalizeRole = (role: string) => {
    if (role === "ngo_business" || role === "ngo_requester") return "ngo";
    return role;
  };

  const role = user?.role ? normalizeRole(user.role) : null;

  const renderDashboard = () => {
    if (!role) return <div>No Role Assigned</div>;
    switch (role) {
      case "student":
        return <StudentDashboard user={user} />;
      case "parent":
        return <ParentDashboard user={user} />;
      case "school":
        return <SchoolDashboard user={user} />;
      case "ngo":
        return <NGODashboard user={user} />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <div>Invalid Role: {role}</div>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!hasStarted ? (
        <motion.div key="landing">
          <LandingPage onGetStarted={handleGetStarted} />
        </motion.div>

      ) : !selectedRole ? (
        <motion.div key="role">
          <RoleSelector onSelectRole={(r) => setSelectedRole(r.role)} />
        </motion.div>

      ) : !user ? (
        <motion.div key="onboarding">
          {selectedRole === "student" && <StudentOnboarding onComplete={handleFinishOnboarding} />}
          {selectedRole === "parent" && <ParentOnboarding onComplete={handleFinishOnboarding} />}
          {selectedRole === "school" && <SchoolOnboarding onComplete={handleFinishOnboarding} />}
          {selectedRole === "ngo" && <NGOOnboarding onComplete={handleFinishOnboarding} />}
        </motion.div>

      ) : showRoleSelector || !user.role ? (
        <motion.div key="role-selector">
          <RoleSelector onSelectRole={(r) => setSelectedRole(r.role)} />
        </motion.div>

      ) : (
        <motion.div key="dashboard">
          {renderDashboard()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}