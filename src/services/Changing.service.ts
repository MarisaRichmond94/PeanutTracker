import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Changing } from '@models';

const changingCollection = collection(db, 'changings');

export const createNewChanging = async (changing: Omit<Changing, 'id'>) => {
  await addDoc(changingCollection, {
    ...changing,
    timestamp: Timestamp.now().toDate().toISOString(),
  });
};

export const getChangings = async (): Promise<Changing[]> => {
  try {
    const q = query(changingCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Changing[];
  } catch (error) {
    console.error('Error fetching changings:', error);
    throw error;
  }
};

export const getChangingsInRange = async (startDate: Date, endDate: Date): Promise<Changing[]> => {
  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  const q = query(changingCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Changing[];
};

export const getTodayChangings = async (): Promise<Changing[]> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return getChangingsInRange(startOfDay, endOfDay);
};

export const updateChanging = async (id: string, updatedData: Partial<Changing>) => {
  const changingDoc = doc(db, 'changings', id);
  await updateDoc(changingDoc, updatedData);
};

export const deleteChanging = async (id: string) => {
  const changingDoc = doc(db, 'changings', id);
  await deleteDoc(changingDoc);
};
