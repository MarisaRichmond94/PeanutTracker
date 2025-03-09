import { isNil } from 'lodash';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { Gender, Profile } from '@models';
import { getProfile } from '@services';
import { getAge } from '@utils';

import { useAuthentication } from './Authentication.context';

export type ProfileState = {
  age?: string;
  birthday?: string;
  firstName: string;
  gender: Gender;
  name?: string;
  profile: Profile | null;

  loadProfile: (email: string) => void;
}

const ProfileContext = createContext<ProfileState | undefined>(undefined);

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const { email, user } = useAuthentication();

  const [age, setAge] = useState<string | undefined>();
  const [birthday, setBirthday] = useState<string | undefined>();
  const [gender, setGender] = useState<Gender>(Gender.UNKNOWN);
  const [name, setName] = useState<string | undefined>();
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async (email: string) => {
    const loadedProfile = await getProfile(email);
    setProfile(loadedProfile);
    setAge(isNil(loadedProfile?.birthday) ? 'Unknown' : getAge(loadedProfile?.birthday));
    setBirthday(loadedProfile?.birthday || 'Unknown');
    setGender(loadedProfile?.gender || Gender.UNKNOWN);
    setName(
      [loadedProfile?.firstName, loadedProfile?.middleName, loadedProfile?.lastName]
        .filter((it) => !isNil(it)).join(' ') ||
        `Baby ${user?.displayName?.split(' ')[1]}`
    );
  };

  useEffect(() => {
    if (!isNil(email)) {
      void loadProfile(email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const value = {
    age,
    birthday,
    firstName: profile?.firstName || 'Peanut',
    gender,
    name,
    profile,

    loadProfile,
  };

  return (
    <ProfileContext.Provider {...{ value }}>
      {children}
    </ProfileContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (isNil(context)) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};
