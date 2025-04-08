import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 用户信息接口
export interface UserInfo {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  interests?: string[];
  conversationHistory: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }[];
}

// 创建默认的用户信息
const createDefaultUserInfo = (): UserInfo => {
  return {
    id: Math.random().toString(36).substring(2, 9), // 生成随机ID
    conversationHistory: [],
  };
};

// 创建用户上下文
interface UserContextType {
  userInfo: UserInfo;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  addToConversationHistory: (role: 'user' | 'assistant', content: string) => void;
  clearConversationHistory: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// 用户信息提供者组件
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    // 从localStorage尝试加载用户信息
    if (typeof window !== 'undefined') {
      const savedUserInfo = localStorage.getItem('userInfo');
      if (savedUserInfo) {
        try {
          return JSON.parse(savedUserInfo);
        } catch (error) {
          console.error('Failed to parse user info from localStorage', error);
        }
      }
    }
    return createDefaultUserInfo();
  });

  // 当用户信息变化时保存到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }, [userInfo]);

  // 更新用户信息
  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      ...info,
    }));
  };

  // 添加对话历史
  const addToConversationHistory = (role: 'user' | 'assistant', content: string) => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      conversationHistory: [
        ...prevInfo.conversationHistory,
        { role, content, timestamp: Date.now() },
      ].slice(-50), // 保留最近50条消息
    }));
  };

  // 清除对话历史
  const clearConversationHistory = () => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      conversationHistory: [],
    }));
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        updateUserInfo,
        addToConversationHistory,
        clearConversationHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 使用用户上下文的钩子
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 