import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Feeding } from '@models';

const feedingCollection = collection(db, 'feedings');

export const createNewFeeding = async (feeding: Omit<Feeding, 'id'>) => {
  await addDoc(feedingCollection, {
    ...feeding,
    timestamp: Timestamp.now().toDate().toISOString(),
  });
};

export const getFeedings = async (): Promise<Feeding[]> => {
  const snapshot = await getDocs(feedingCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feeding[];
};

export const getFeedingsInRange = async (startDate: Date, endDate: Date): Promise<Feeding[]> => {
  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  const q = query(feedingCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feeding[];
};

export const getTodayFeedings = async (): Promise<Feeding[]> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return getFeedingsInRange(startOfDay, endOfDay);
};

export const updateFeeding = async (id: string, updatedData: Partial<Feeding>) => {
  const feedingDoc = doc(db, 'feedings', id);
  await updateDoc(feedingDoc, updatedData);
};

export const deleteFeeding = async (id: string) => {
  const feedingDoc = doc(db, 'feedings', id);
  await deleteDoc(feedingDoc);
};
