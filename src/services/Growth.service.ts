import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Growth } from '@models';

const growthCollection = collection(db, 'growths');

export const createNewGrowth = async (growth: Omit<Growth, 'id'>) => {
  await addDoc(growthCollection, { ...growth });
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

export const getGrowthsInRange = async (startTimestamp: string, endTimestamp: string): Promise<Growth[]> => {
  const q = query(growthCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Growth[];
};

export const updateGrowth = async (id: string, updatedData: Partial<Growth>) => {
  const growthDoc = doc(db, 'growths', id);
  await updateDoc(growthDoc, updatedData);
};

export const deleteGrowth = async (id: string) => {
  const growthDoc = doc(db, 'growths', id);
  await deleteDoc(growthDoc);
};
