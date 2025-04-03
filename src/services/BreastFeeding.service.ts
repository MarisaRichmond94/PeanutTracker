import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { BreastFeeding } from '@models';

const breastFeedingCollection = collection(db, 'breast_feedings');

export const createNewBreastFeeding = async (feeding: Omit<BreastFeeding, 'id'>) => {
  await addDoc(breastFeedingCollection, { ...feeding });
};

export const getBreastFeedings = async (): Promise<BreastFeeding[]> => {
  try {
    const q = query(breastFeedingCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BreastFeeding[];
  } catch (error) {
    console.error('Error fetching breast_feedings:', error);
    throw error;
  }
};

export const getBreastFeedingsInRange = async (startTimestamp: string, endTimestamp: string): Promise<BreastFeeding[]> => {
  const q = query(breastFeedingCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BreastFeeding[];
};

export const getTodayBreastFeedings = async (): Promise<BreastFeeding[]> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return getBreastFeedingsInRange(startOfDay.toISOString(), endOfDay.toISOString());
};

export const updateBreastFeeding = async (id: string, updatedData: Partial<BreastFeeding>) => {
  const feedingDoc = doc(db, 'breast_feedings', id);
  await updateDoc(feedingDoc, updatedData);
};

export const deleteBreastFeeding = async (id: string) => {
  const feedingDoc = doc(db, 'breast_feedings', id);
  await deleteDoc(feedingDoc);
};
