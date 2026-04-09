import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp, terminate, clearIndexedDbPersistence } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
let isSigningIn = false;
let lastSignInTime = 0;

export const signInWithGoogle = async () => {
  const now = Date.now();
  // Prevent multiple calls within 2 seconds
  if (isSigningIn || (now - lastSignInTime < 2000)) return null;
  
  try {
    isSigningIn = true;
    lastSignInTime = now;
    
    // Small delay to ensure browser state is settled in iframe
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    // Handle common popup errors gracefully
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      console.log("User closed or cancelled the login popup.");
      return null;
    }
    console.error("Error signing in with Google:", error);
    throw error;
  } finally {
    // Add a small delay before resetting the flag
    setTimeout(() => {
      isSigningIn = false;
    }, 1000);
  }
};

export const logout = () => auth.signOut();

export const resetUserData = async () => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  try {
    // 1. Delete the user document from Firestore
    await deleteDoc(doc(db, "users", uid));
    
    // 2. Delete private details if they exist
    await deleteDoc(doc(db, "student_private_details", uid));
    
    // 3. Sign out
    await auth.signOut();
    
    // 3. Clear Firestore local cache (IndexedDB)
    await terminate(db);
    await clearIndexedDbPersistence(db);
    
    // 4. Force reload to clear any local React state
    window.location.reload();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
  }
};

// Firestore Error Handler Spec
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
