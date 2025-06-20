'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

interface ProvidersProps {
  children: ReactNode;
}

interface User {
  id: string;
  email: string;
  username: string | null;
  isEmailVerified: boolean;
  credits: number;
  subscriptionCredits?: number;
  subscriptionStatus?: string | null;
  subscriptionPlan?: string | null;
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// 全局认证状态管理器
function AuthStateManager({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);
  
  // 缓存时间：5分钟
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchUserData = async (force = false) => {
    // 如果没有session，直接返回
    if (!session?.user) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // 检查缓存是否有效（除非强制刷新）
    const now = Date.now();
    if (!force && user && (now - lastFetch) < CACHE_DURATION) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setLastFetch(now);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData(true);
  };

  // 当session状态变化时获取用户数据
  useEffect(() => {
    if (status !== 'loading') {
      fetchUserData();
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 认证状态同步组件
function AuthSyncProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [lastSessionUpdate, setLastSessionUpdate] = useState<string>('');

  // 当认证状态变化时触发全局事件
  useEffect(() => {
    if (status !== 'loading') {
      // 创建会话标识符来防止重复触发
      const sessionId = session?.user?.email ? `${session.user.email}-${status}` : `none-${status}`;
      
      // 只有当会话状态真正改变时才触发事件
      if (sessionId !== lastSessionUpdate) {
        console.log('AuthSyncProvider: 认证状态变化', { status, session: session?.user?.email });
        
        // 触发自定义事件通知其他组件认证状态已更新
        window.dispatchEvent(new CustomEvent('authStatusChanged', {
          detail: { session, status }
        }));
        
        setLastSessionUpdate(sessionId);
      }
    }
  }, [session, status, lastSessionUpdate]);

  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      refetchInterval={10 * 60} // 10分钟刷新一次
      refetchOnWindowFocus={false} // 禁用窗口焦点刷新
    >
      <AuthSyncProvider>
        <AuthStateManager>
          {children}
        </AuthStateManager>
      </AuthSyncProvider>
    </SessionProvider>
  );
} 