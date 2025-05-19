import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';

import { db } from '@firebase';
import { DefaultSettings } from '@models';

const defaultSettingsCollection = collection(db, 'default_settings');

export const createDefaultSettings = async (defaultSettings: Omit<DefaultSettings, 'id'>) => {
  await addDoc(defaultSettingsCollection, { ...defaultSettings });
};

export const getDefaultSettings = async (): Promise<DefaultSettings> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'default_settings'));
    return querySnapshot.docs.map(doc => doc.data() as DefaultSettings)?.[0];
  } catch (error) {
    console.error('Error fetching DefaultSettings:', error);
    throw error;
  }
};

export const updatedefaultSettings = async (id: string, updatedData: Partial<DefaultSettings>) => {
  const defaultSettingsDoc = doc(db, 'DefaultSettings', id);
  await updateDoc(defaultSettingsDoc, updatedData);
};
