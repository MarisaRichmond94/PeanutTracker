import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Changing } from '@models';

const changingCollection = collection(db, 'changings');

export const createNewChanging = async (changing: Omit<Changing, 'id'>) => {
  await addDoc(changingCollection, { ...changing });
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

export const getChangingsInRange = async (startTimestamp: string, endTimestamp: string): Promise<Changing[]> => {

  const q = query(changingCollection, where('timestamp', '>=', startTimestamp), where('timestamp', '<=', endTimestamp), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Changing[];
};

export const updateChanging = async (id: string, updatedData: Partial<Changing>) => {
  const changingDoc = doc(db, 'changings', id);
  await updateDoc(changingDoc, updatedData);
};

export const deleteChanging = async (id: string) => {
  const changingDoc = doc(db, 'changings', id);
  await deleteDoc(changingDoc);
};
