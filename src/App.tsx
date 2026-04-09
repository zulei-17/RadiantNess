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
      let currentUser = auth.currentUser;
      
      // If not logged in, sign in first
      if (!currentUser) {
        currentUser = await signInWithGoogle();
      }

      if (currentUser && selectedRole) {
        const uid = currentUser.uid;
        const isStudent = selectedRole === "student";

        // Calculate needsSupplies for students
        const needsSupplies = isStudent ? (
          answers?.answers?.help_needed === "sanitary_products" ||
          answers?.answers?.help_needed === "clothes" ||
          answers?.answers?.help_needed === "stationery" ||
          answers?.answers?.attendance_barriers === "sanitary_products" ||
          answers?.answers?.attendance_barriers === "clothes" ||
          answers?.answers?.attendance_barriers === "stationery" ||
          answers?.answers?.basic_needs === "no"
        ) : false;

        // 1. Save public profile (no email or sensitive details for students)
        await setDoc(
          doc(db, "users", uid),
          {
            userRole: selectedRole,
            uid: uid,
            displayName: currentUser.displayName || answers?.name || "Radiant User",
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            streak: 0,
            confidenceScore: 0,
            needsSupplies: needsSupplies, // Non-sensitive flag
            // Only store onboardingData in public profile if NOT a student
            ...(isStudent ? {} : { onboardingData: answers, email: currentUser.email })
          },
          { merge: true }
        );

        // 2. Save private details (Admin ONLY access)
        if (isStudent) {
          await setDoc(
            doc(db, "student_private_details", uid),
            {
              uid: uid,
              email: currentUser.email,
              onboardingData: answers,
              updatedAt: serverTimestamp()
            }
          );
        }

        // 3. Update local user state to trigger dashboard transition
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setUser({
            ...currentUser,
            ...userDoc.data(),
            role: selectedRole
          });
        }
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
        return <StudentDashboard user={user} userName={user.onboardingData?.name || user.displayName || "Radiant"} onboardingData={user.onboardingData} />;
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

      ) : !selectedRole && (!user || !user.role) ? (
        <motion.div key="role">
          <RoleSelector onSelectRole={(r) => setSelectedRole(r.role)} />
        </motion.div>

      ) : selectedRole && (!user || !user.role) ? (
        <motion.div key="onboarding">
          {selectedRole === "student" && <StudentOnboarding onComplete={handleFinishOnboarding} onBack={() => setSelectedRole(null)} />}
          {selectedRole === "parent" && <ParentOnboarding onComplete={handleFinishOnboarding} onBack={() => setSelectedRole(null)} />}
          {selectedRole === "school" && <SchoolOnboarding onComplete={handleFinishOnboarding} onBack={() => setSelectedRole(null)} />}
          {selectedRole === "ngo" && <NGOOnboarding onComplete={handleFinishOnboarding} onBack={() => setSelectedRole(null)} />}
        </motion.div>

      ) : (
        <motion.div key="dashboard">
          {renderDashboard()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}