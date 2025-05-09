import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Feeding } from '@models';

const feedingCollection = collection(db, 'feedings');

export const createNewFeeding = async (feeding: Omit<Feeding, 'id'>) => {
  await addDoc(feedingCollection, { ...feeding });
};

export const getFeedings = async (): Promise<Feeding[]> => {
  try {
    const q = query(feedingCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feeding[];
  } catch (error) {
    console.error('Error fetching feedings:', error);
    throw error;
  }
};

export const getFeedingsInRange = async (startTimestamp: string, endTimestamp: string): Promise<Feeding[]> => {
  const q = query(feedingCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feeding[];
};

export const updateFeeding = async (id: string, updatedData: Partial<Feeding>) => {
  const feedingDoc = doc(db, 'feedings', id);
  await updateDoc(feedingDoc, updatedData);
};

export const deleteFeeding = async (id: string) => {
  const feedingDoc = doc(db, 'feedings', id);
  await deleteDoc(feedingDoc);
};
