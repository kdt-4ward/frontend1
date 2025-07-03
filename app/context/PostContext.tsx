// PostContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface PostData {
  images: string[];
  caption: string;
}

const PostContext = createContext<{
  post: PostData;
  setPost: React.Dispatch<React.SetStateAction<PostData>>;
}>({
  post: { images: [], caption: '' },
  setPost: () => {},
});

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [post, setPost] = useState<PostData>({ images: [], caption: '' });
  return (
    <PostContext.Provider value={{ post, setPost }}>
      {children}
    </PostContext.Provider>
  );
};
