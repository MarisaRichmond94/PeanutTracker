import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { BottleFeeding } from '@models';

const bottleFeedingCollection = collection(db, 'bottle_feedings');

export const createNewBottleFeeding = async (feeding: Omit<BottleFeeding, 'id'>) => {
  await addDoc(bottleFeedingCollection, {
    ...feeding,
    timestamp: Timestamp.now().toDate().toISOString(),
  });
};

export const getBottleFeedings = async (): Promise<BottleFeeding[]> => {
  try {
    const q = query(bottleFeedingCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BottleFeeding[];
  } catch (error) {
    console.error('Error fetching bottle_feedings:', error);
    throw error;
  }
};

export const getBottleFeedingsInRange = async (startTimestamp: string, endTimestamp: string): Promise<BottleFeeding[]> => {
  const q = query(bottleFeedingCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BottleFeeding[];
};

export const updateBottleFeeding = async (id: string, updatedData: Partial<BottleFeeding>) => {
  const feedingDoc = doc(db, 'bottle_feedings', id);
  await updateDoc(feedingDoc, updatedData);
};

export const deleteBottleFeeding = async (id: string) => {
  const feedingDoc = doc(db, 'bottle_feedings', id);
  await deleteDoc(feedingDoc);
};
