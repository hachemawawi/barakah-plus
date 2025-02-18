import { Timestamp } from 'firebase/firestore';

export interface FoodItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  expiryDate: Timestamp;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'available' | 'reserved' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  stats: {
    itemsShared: number;
    itemsReceived: number;
    foodSaved: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Transaction {
  id: string;
  foodItemId: string;
  donorId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}