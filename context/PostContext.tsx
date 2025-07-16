import React, { createContext, useContext, useState } from 'react';

export interface PostData {
  images: string[];
  caption: string;
  author: string;
}

const PostContext = createContext<{
  draftPost: PostData;
  setDraftPost: React.Dispatch<React.SetStateAction<PostData>>;
} | undefined>(undefined);

export const usePosts = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error("usePosts must be used within PostProvider");
  return ctx;
};

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [draftPost, setDraftPost] = useState<PostData>({ images: [], caption: '', author: '' });

  return (
    <PostContext.Provider value={{ draftPost, setDraftPost }}>
      {children}
    </PostContext.Provider>
  );
};
