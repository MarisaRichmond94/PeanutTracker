import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Chore } from '@models';

const choreCollection = collection(db, 'chores');

export const createNewChore = async (chore: Omit<Chore, 'id'>) => {
  await addDoc(choreCollection, {
    ...chore,
    timestamp: Timestamp.now().toDate().toISOString(),
  });
};

export const getChores = async (): Promise<Chore[]> => {
  try {
    const q = query(choreCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Chore[];
  } catch (error) {
    console.error('Error fetching chores:', error);
    throw error;
  }
};

export const updateChore = async (id: string, updatedData: Partial<Chore>) => {
  const choreDoc = doc(db, 'chores', id);
  await updateDoc(choreDoc, updatedData);
};

export const deleteChore = async (id: string) => {
  const choreDoc = doc(db, 'chores', id);
  await deleteDoc(choreDoc);
};
