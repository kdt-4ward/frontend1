import React, { createContext, useContext, useState } from 'react';

// ✅ 1. 타입 정의
export interface User {
  user_id: string;
  name: string;
  email: string;
  couple_id: string;
}

// ✅ 2. Context 생성
const UserContext = createContext<{
  userInfo: User | null;
  setUserInfo: (user: User) => void;
} | undefined>(undefined);

// ✅ 3. Context 사용 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser는 반드시 UserProvider 안에서 사용해야 합니다.');
  }
  return context;
};

// ✅ 4. Provider 컴포넌트
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>({
    user_id: 'test1',
    name: '테스트유저1',
    email: 'test1@example.com',
    couple_id: 'couple1',
  });

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
