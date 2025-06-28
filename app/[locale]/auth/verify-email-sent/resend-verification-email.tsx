'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ResendVerificationEmailProps {
  email: string;
  locale: string;
}

export default function ResendVerificationEmail({ email, locale }: ResendVerificationEmailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  
  const t = useTranslations('auth.verifyEmailSent');
  const tErrors = useTranslations('auth.errors');

  const handleResend = async () => {
    if (isLoading || cooldownRemaining > 0) return;

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        
        // 启动冷却期倒计时
        if (data.cooldownMinutes) {
          setCooldownRemaining(data.cooldownMinutes * 60); // 转换为秒
          
          const countdown = setInterval(() => {
            setCooldownRemaining((prev) => {
              if (prev <= 1) {
                clearInterval(countdown);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        if (response.status === 429) {
          // 冷却期错误
          setMessage(data.error);
          setMessageType('error');
          
          // 从错误消息中提取冷却时间（简化处理）
          setCooldownRemaining(5 * 60); // 5分钟
        } else if (response.status === 400 && data.error.includes('已经验证')) {
          setMessage(data.error);
          setMessageType('success');
        } else {
          setMessage(data.error || tErrors('networkError'));
          setMessageType('error');
        }
      }
    } catch (error) {
      setMessage(tErrors('networkError'));
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCooldownTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isDisabled = isLoading || cooldownRemaining > 0;

  return (
    <div className="space-y-3">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={isDisabled}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('sending')}
            </span>
          ) : cooldownRemaining > 0 ? (
            t('resendCooldown', { time: formatCooldownTime(cooldownRemaining) })
          ) : (
            t('resendEmail')
          )}
        </button>
      </div>
      
      {cooldownRemaining > 0 && (
        <div className="text-xs text-gray-500 text-center">
          {t('cooldownMessage', { time: formatCooldownTime(cooldownRemaining) })}
        </div>
      )}
    </div>
  );
} 