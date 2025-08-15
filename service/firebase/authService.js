import { auth } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

// Login function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Register function
export const register = async (email, password, displayName, role = 'intern') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name and role
    await updateProfile(user, {
      displayName: displayName,
    });

    // You can store additional user data in Firestore here
    // For now, we'll store role in localStorage as a temporary solution
    localStorage.setItem('userRole', role);
    
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Password reset function
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Subscribe to authentication state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

// Get user role (temporary implementation using localStorage)
export const getUserRole = () => {
  const user = auth.currentUser;
  if (user) {
    // In a real implementation, you'd fetch this from Firestore
    return localStorage.getItem('userRole') || 'intern';
  }
  return null;
};
