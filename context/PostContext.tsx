// import React, { createContext, useContext, useState } from 'react';
// // ... 기존 코드 위에 있음
// export interface PostData {
//   images: string[];
//   caption: string;
//   author: string;
// }

// // ↓ 여기서부터
// const PostContext = createContext<{
//   posts: PostData[];
//   addPost: (post: PostData) => void;
//   draftPost: PostData;
//   setDraftPost: (p: PostData) => void;
//   updatePost: (index: number, post: PostData) => void;  // 추가
//   deletePost: (index: number) => void;                 // 추가
// } | undefined>(undefined);

// export const usePosts = () => {
//   const ctx = useContext(PostContext);
//   if (!ctx) throw new Error("usePosts must be used within PostProvider");
//   return ctx;
// };

// export const PostProvider = ({ children }: { children: React.ReactNode }) => {
//   const [posts, setPosts] = useState<PostData[]>([]);
//   const [draftPost, setDraftPost] = useState<PostData>({ images: [], caption: '', author:''});

//   const addPost = (post: PostData) => setPosts((prev) => [post, ...prev]);

//   // index로 수정
//   const updatePost = (index: number, post: PostData) => {
//     setPosts((prev) =>
//       prev.map((p, i) => (i === index ? post : p))
//     );
//   };

//   // index로 삭제
//   const deletePost = (index: number) => {
//     setPosts((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <PostContext.Provider value={{ posts, addPost, draftPost, setDraftPost, updatePost, deletePost }}>
//       {children}
//     </PostContext.Provider>
//   );
// };
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
