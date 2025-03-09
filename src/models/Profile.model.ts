export enum Gender {
  FEMALE = 'female',
  MALE = 'male',
  UNKNOWN = 'unknown',
}

export type Profile = {
  id: string;
  avatar?: string;
  birthday?: string;
  email: string;
  gender?: Gender;
  firstName?: string;
  lastName?: string;
  middleName?: string;
};
