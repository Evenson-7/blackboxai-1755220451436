import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

// Generic function to fetch all documents from a collection
export const fetchCollection = async (collectionName) => {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error fetching ${collectionName}: ${error.message}`);
  }
};

// Generic function to fetch a single document
export const fetchDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Document not found");
    }
  } catch (error) {
    throw new Error(`Error fetching document: ${error.message}`);
  }
};

// Generic function to add a document to a collection
export const addDocument = async (collectionName, data) => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef;
  } catch (error) {
    throw new Error(`Error adding document: ${error.message}`);
  }
};

// Generic function to update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    return docRef;
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

// Generic function to delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

// Function to query documents with conditions
export const queryDocuments = async (collectionName, conditions = [], orderByField = null, limitCount = null) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply where conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField.field, orderByField.direction || 'asc'));
    }
    
    // Apply limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error querying documents: ${error.message}`);
  }
};

// Function to listen to real-time updates
export const subscribeToCollection = (collectionName, callback, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply where conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    return onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(documents);
    });
  } catch (error) {
    throw new Error(`Error subscribing to collection: ${error.message}`);
  }
};

// Specific functions for OJT system

// Timesheet functions
export const addTimesheet = async (userId, timesheetData) => {
  return await addDocument('timesheets', { userId, ...timesheetData });
};

export const getUserTimesheets = async (userId) => {
  return await queryDocuments('timesheets', [
    { field: 'userId', operator: '==', value: userId }
  ], { field: 'date', direction: 'desc' });
};

// Leave request functions
export const addLeaveRequest = async (userId, leaveData) => {
  return await addDocument('leaveRequests', { userId, status: 'pending', ...leaveData });
};

export const getLeaveRequests = async (status = null) => {
  const conditions = status ? [{ field: 'status', operator: '==', value: status }] : [];
  return await queryDocuments('leaveRequests', conditions, { field: 'createdAt', direction: 'desc' });
};

// Daily report functions
export const addDailyReport = async (userId, reportData) => {
  return await addDocument('dailyReports', { userId, status: 'pending', ...reportData });
};

export const getDailyReports = async (userId = null) => {
  const conditions = userId ? [{ field: 'userId', operator: '==', value: userId }] : [];
  return await queryDocuments('dailyReports', conditions, { field: 'date', direction: 'desc' });
};

// Performance evaluation functions
export const addPerformanceEvaluation = async (userId, evaluationData) => {
  return await addDocument('performanceEvaluations', { userId, ...evaluationData });
};

export const getUserPerformanceEvaluations = async (userId) => {
  return await queryDocuments('performanceEvaluations', [
    { field: 'userId', operator: '==', value: userId }
  ], { field: 'evaluationDate', direction: 'desc' });
};
