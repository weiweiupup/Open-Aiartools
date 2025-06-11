import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { users, verificationTokens, type User, type NewUser, type NewVerificationToken } from './schema';
import { hashPassword, generateVerificationToken, generateExpirationTime } from './auth-utils';

// 根据邮箱查找用户
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  } catch (error) {
    console.error('查找用户失败:', error);
    return null;
  }
}

// 根据ID查找用户
export async function findUserById(id: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  } catch (error) {
    console.error('查找用户失败:', error);
    return null;
  }
}

// 创建新用户
export async function createUser(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
  try {
    // 检查用户是否已存在
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('邮箱已被注册');
    }

    // 哈希密码
    const hashedPassword = userData.password ? await hashPassword(userData.password) : null;

    const [newUser] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
      isEmailVerified: false,
    }).returning();

    return newUser;
  } catch (error) {
    console.error('创建用户失败:', error);
    return null;
  }
}

// 更新用户
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser || null;
  } catch (error) {
    console.error('更新用户失败:', error);
    return null;
  }
}

// 验证用户邮箱
export async function verifyUserEmail(userId: string): Promise<boolean> {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        isEmailVerified: true, 
        emailVerified: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();

    return !!updatedUser;
  } catch (error) {
    console.error('验证邮箱失败:', error);
    return false;
  }
}

// 创建验证令牌
export async function createVerificationToken(
  email: string, 
  type: 'email_verification' | 'password_reset',
  expirationHours: number = 24
): Promise<string | null> {
  try {
    const token = generateVerificationToken();
    const expires = generateExpirationTime(expirationHours);

    // 删除旧的相同类型的令牌
    await db.delete(verificationTokens).where(
      and(
        eq(verificationTokens.email, email),
        eq(verificationTokens.type, type)
      )
    );

    // 创建新令牌 - 使用原有的字段结构
    await db.insert(verificationTokens).values({
      email,
      token,
      expires,
      type,
    });

    return token;
  } catch (error) {
    console.error('创建验证令牌失败:', error);
    return null;
  }
}

// 验证令牌
export async function verifyToken(token: string, type: 'email_verification' | 'password_reset'): Promise<{
  isValid: boolean;
  email?: string;
}> {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, type)
        )
      );

    if (!verificationToken) {
      return { isValid: false };
    }

    // 检查是否过期
    if (new Date() > verificationToken.expires) {
      // 删除过期令牌
      await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
      return { isValid: false };
    }

    return { isValid: true, email: verificationToken.email || undefined };
  } catch (error) {
    console.error('验证令牌失败:', error);
    return { isValid: false };
  }
}

// 删除验证令牌
export async function deleteVerificationToken(token: string): Promise<boolean> {
  try {
    await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
    return true;
  } catch (error) {
    console.error('删除令牌失败:', error);
    return false;
  }
}

// 更新用户密码
export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword);
    const [updatedUser] = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date() 
      })
      .where(eq(users.email, email))
      .returning();

    return !!updatedUser;
  } catch (error) {
    console.error('更新密码失败:', error);
    return false;
  }
} 