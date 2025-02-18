import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  Timestamp,
  GeoPoint,
} from 'firebase/firestore';
import { db } from './firebase';
import type { FoodItem, UserProfile, Transaction } from '../types/database';

// Food Items
export const getFoodItems = async () => {
  const q = query(
    collection(db, 'foodItems'),
    where('status', '==', 'available'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodItem));
};

export const getNearbyFoodItems = async (latitude: number, longitude: number, radiusInKm: number) => {
  // In a production app, you'd use a geospatial query here
  // For now, we'll get all items and filter client-side
  const items = await getFoodItems();
  return items.filter(item => {
    const distance = calculateDistance(
      latitude,
      longitude,
      item.location.coordinates.latitude,
      item.location.coordinates.longitude
    );
    return distance <= radiusInKm;
  });
};

export const createFoodItem = async (data: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'foodItems'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

// User Profiles
export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, 'userProfiles', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

export const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const docRef = doc(db, 'userProfiles', userId);
  await updateDoc(docRef, {
    ...data,
    stats: {
      itemsShared: 0,
      itemsReceived: 0,
      foodSaved: 0,
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

// Transactions
export const createTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'transactions'), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateTransactionStatus = async (
  transactionId: string,
  status: Transaction['status']
) => {
  const docRef = doc(db, 'transactions', transactionId);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  });
};

// Utility functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}