import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    console.log('准备发送邮件:', {
      to,
      subject,
      from: process.env.RESEND_FROM_EMAIL,
      apiKeyExists: !!process.env.RESEND_API_KEY
    });

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY未设置');
      return { success: false, error: 'RESEND_API_KEY未设置' };
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('RESEND_FROM_EMAIL未设置');
      return { success: false, error: 'RESEND_FROM_EMAIL未设置' };
    }

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      html,
    });

    console.log('邮件发送成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('邮件发送失败详细信息:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      to,
      subject
    });
    return { success: false, error };
  }
}

export function generateVerificationEmailHtml(verificationUrl: string, locale: string = 'en') {
  const isZh = locale === 'zh';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${isZh ? '邮箱验证' : 'Email Verification'}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Aiartools</h1>
        <h2>${isZh ? '邮箱验证' : 'Email Verification'}</h2>
      </div>
      <div class="content">
        <p>${isZh ? '您好！' : 'Hello!'}</p>
        <p>${isZh ? '感谢您注册Aiartools！请点击下面的按钮验证您的邮箱地址：' : 'Thank you for signing up for Aiartools! Please click the button below to verify your email address:'}</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">
            ${isZh ? '验证邮箱' : 'Verify Email'}
          </a>
        </div>
        
        <p>${isZh ? '或者复制以下链接到浏览器中：' : 'Or copy and paste this link into your browser:'}</p>
        <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
          ${verificationUrl}
        </p>
        
        <p style="margin-top: 30px;">
          ${isZh ? '此链接将在24小时后过期。' : 'This link will expire in 24 hours.'}
        </p>
        
        <p>
          ${isZh ? '如果您没有注册Aiartools账户，请忽略此邮件。' : 'If you did not sign up for Aiartools, please ignore this email.'}
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Aiartools. ${isZh ? '保留所有权利。' : 'All rights reserved.'}</p>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmailHtml(resetUrl: string, locale: string = 'zh'): string {
  const isZh = locale === 'zh';
  
  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isZh ? 'Aiartools - 密码重置' : 'Aiartools - Password Reset'}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background-color: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin: 20px 0;
        }
        .content {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 14px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Aiartools</div>
          <h1 class="title">${isZh ? '密码重置请求' : 'Password Reset Request'}</h1>
        </div>
        
        <div class="content">
          <p>${isZh ? '您好！' : 'Hello!'}</p>
          <p>${isZh 
            ? '我们收到了您的密码重置请求。点击下面的按钮来重置您的密码：' 
            : 'We received a request to reset your password. Click the button below to reset your password:'
          }</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">
              ${isZh ? '重置密码' : 'Reset Password'}
            </a>
          </div>
          
          <div class="warning">
            <p><strong>${isZh ? '重要提示：' : 'Important:'}</strong></p>
            <ul>
              <li>${isZh ? '此链接将在24小时后过期' : 'This link will expire in 24 hours'}</li>
              <li>${isZh ? '如果您没有请求重置密码，请忽略此邮件' : 'If you did not request this password reset, please ignore this email'}</li>
              <li>${isZh ? '为了安全，请不要将此链接分享给他人' : 'For security reasons, do not share this link with others'}</li>
            </ul>
          </div>
          
          <p>${isZh 
            ? '如果按钮无法点击，请复制以下链接到浏览器中打开：' 
            : 'If the button doesn\'t work, copy and paste this link into your browser:'
          }</p>
          <p style="word-break: break-all; color: #667eea; font-size: 14px;">
            ${resetUrl}
          </p>
        </div>
        
        <div class="footer">
          <p>${isZh ? '此邮件由 Aiartools 自动发送，请勿回复。' : 'This email was sent automatically by Aiartools. Please do not reply.'}</p>
          <p>&copy; 2025 Aiartools. ${isZh ? '保留所有权利。' : 'All rights reserved.'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 