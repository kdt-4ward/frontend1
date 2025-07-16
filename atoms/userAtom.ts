import { atom } from 'jotai';

export interface User {
  user_id: string;
  nickname: string;
  profile_image: string;
  couple_id: string;
  email: string;
}

export const userAtom = atom<User | null>(null);