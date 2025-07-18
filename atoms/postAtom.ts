import { atom } from 'jotai';

export interface PostData {
  images: string[];
  caption: string;
  author: string;
}

// 게시글 임시 작성 데이터(이미지, 캡션, 작성자)
export const draftPostAtom = atom<PostData>({
  images: [],
  caption: '',
  author: '',
});
