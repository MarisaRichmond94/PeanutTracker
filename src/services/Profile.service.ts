import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

import { db, storage } from '@firebase';
import { Profile } from '@models';

export const getProfile = async (email: string): Promise<Profile | null> => {
  const profilesRef = collection(db, 'profiles');
  const q = query(profilesRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  return querySnapshot.docs[0].data() as Profile;
};

export const updateAvatar = async (id: string, imageUrl: string) => {
  const profileRef = doc(db, 'profiles', id);
  await setDoc(profileRef, { avatar: imageUrl }, { merge: true });
};

export const saveProfile = async (id: string, profileData: Omit<Profile, 'id'>) => {
  const profileRef = doc(db, 'profiles', id);
  await setDoc(profileRef, { id, ...profileData }, { merge: true });
};

export const createProfile = async (profile: Omit<Profile, 'id'>) => {
  const profileRef = doc(db, 'profiles', profile.email);
  await setDoc(profileRef, profile, { merge: true });
};

export const uploadProfileAvatar = async (file: File, email: string) => {
  const storageRef = ref(storage, `avatars/${email}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<string>(async (resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null, // Optional progress callback
      (error) => reject(error),
      async () => {
        const avatarUrl = await getDownloadURL(uploadTask.snapshot.ref);

        // Ensure profile exists before updating avatar
        let profile = await getProfile(email);
        if (!profile) {
          profile = { id: email, email }; // Create minimal profile
          await createProfile(profile);
        }

        // Update profile with avatar URL
        await setDoc(doc(db, 'profiles', email), { avatar: avatarUrl }, { merge: true });
        resolve(avatarUrl);
      }
    );
  });
};
