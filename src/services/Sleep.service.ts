import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Sleep } from '@models';

const sleepCollection = collection(db, 'sleeps');

export const createNewSleep = async (sleep: Omit<Sleep, 'id'>) => {
  await addDoc(sleepCollection, {
    ...sleep,
    timestamp: Timestamp.now().toDate().toISOString(),
  });
};

export const getSleeps = async (): Promise<Sleep[]> => {
  try {
    const q = query(sleepCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Sleep[];
  } catch (error) {
    console.error('Error fetching sleeps:', error);
    throw error;
  }
};

export const getSleepsInRange = async (startDate: Date, endDate: Date): Promise<Sleep[]> => {
  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  const q = query(sleepCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Sleep[];
};

export const getTodaySleeps = async (): Promise<Sleep[]> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return getSleepsInRange(startOfDay, endOfDay);
};

export const updateSleep = async (id: string, updatedData: Partial<Sleep>) => {
  const sleepDoc = doc(db, 'sleeps', id);
  await updateDoc(sleepDoc, updatedData);
};

export const deleteSleep = async (id: string) => {
  const sleepDoc = doc(db, 'sleeps', id);
  await deleteDoc(sleepDoc);
};
