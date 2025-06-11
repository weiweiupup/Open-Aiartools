'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ProvidersProps {
  children: ReactNode;
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
    <SessionProvider>
      <AuthSyncProvider>
        {children}
      </AuthSyncProvider>
    </SessionProvider>
  );
} 