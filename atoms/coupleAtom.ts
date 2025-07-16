import { atom } from 'jotai';

export interface Couple {
  couple_id: string;
  user1: {
    user_id: string;
    nickname: string;
    profile_image: string;
  } | null;
  user2: {
    user_id: string;
    nickname: string;
    profile_image: string;
  } | null;
}

export const coupleAtom = atom<Couple | null>(null);