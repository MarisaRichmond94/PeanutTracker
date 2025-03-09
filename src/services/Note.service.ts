import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

import { db } from '@firebase';
import { Note, NotePriority } from '@models';

const notesCollection = collection(db, 'notes');

export const createNote = async (note: Omit<Note, 'id'>): Promise<string> => {
  const docRef = await addDoc(notesCollection, note);
  return docRef.id;
};

export const getAllNotes = async (): Promise<Note[]> => {
  const q = query(notesCollection, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];
};

export const updateNote = async (id: string, updatedFields: Partial<Note>): Promise<void> => {
  const noteRef = doc(db, 'notes', id);
  await updateDoc(noteRef, updatedFields);
};

export const deleteNote = async (id: string): Promise<void> => {
  const noteRef = doc(db, 'notes', id);
  await deleteDoc(noteRef);
};

export const getNotesByPriority = async (priority: NotePriority): Promise<Note[]> => {
  const q = query(notesCollection, where('priority', '==', priority));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];
};
