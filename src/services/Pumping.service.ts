import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Pumping } from '@models';

const pumpingCollection = collection(db, 'pumpings');

export const createNewPumping = async (pumping: Omit<Pumping, 'id'>) => {
  await addDoc(pumpingCollection, { ...pumping });
};

export const getPumpings = async (): Promise<Pumping[]> => {
  try {
    const q = query(pumpingCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Pumping[];
  } catch (error) {
    console.error('Error fetching pumpings:', error);
    throw error;
  }
};

export const getPumpingsInRange = async (startTimestamp: string, endTimestamp: string): Promise<Pumping[]> => {
  const q = query(pumpingCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Pumping[];
};

export const updatePumping = async (id: string, updatedData: Partial<Pumping>) => {
  const pumpingDoc = doc(db, 'pumpings', id);
  await updateDoc(pumpingDoc, updatedData);
};

export const deletePumping = async (id: string) => {
  const pumpingDoc = doc(db, 'pumpings', id);
  await deleteDoc(pumpingDoc);
};
