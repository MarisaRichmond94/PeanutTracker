import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Growth } from '@models';

const growthCollection = collection(db, 'growths');

export const createNewGrowth = async (growth: Omit<Growth, 'id'>) => {
  await addDoc(growthCollection, {
    ...growth,
    timestamp: Timestamp.now().toDate().toISOString(),
  });
};

export const getGrowths = async (): Promise<Growth[]> => {
  try {
    const q = query(growthCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Growth[];
  } catch (error) {
    console.error('Error fetching growths:', error);
    throw error;
  }
};

export const getGrowthsInRange = async (startDate: Date, endDate: Date): Promise<Growth[]> => {
  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  const q = query(growthCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Growth[];
};

export const getTodayGrowths = async (): Promise<Growth[]> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return getGrowthsInRange(startOfDay, endOfDay);
};

export const updateGrowth = async (id: string, updatedData: Partial<Growth>) => {
  const growthDoc = doc(db, 'growths', id);
  await updateDoc(growthDoc, updatedData);
};

export const deleteGrowth = async (id: string) => {
  const growthDoc = doc(db, 'growths', id);
  await deleteDoc(growthDoc);
};
