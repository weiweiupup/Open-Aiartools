import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

// 密码哈希
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// 验证密码
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// 生成验证令牌
export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

// 生成JWT令牌
export function generateJWT(payload: any, expiresIn: string = '7d'): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET 环境变量未设置');
  }
  return jwt.sign(payload, secret, { expiresIn } as any);
}

// 验证JWT令牌
export function verifyJWT(token: string): any {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET 环境变量未设置');
    }
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

// 生成过期时间
export function generateExpirationTime(hours: number = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
} 