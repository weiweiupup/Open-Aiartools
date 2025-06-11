import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { users, userActivities } from "./schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
          })

          if (!user || !user.password) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!passwordsMatch) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        // 如果是OAuth登录，确保用户邮箱已验证
        if (account?.provider === "google" || account?.provider === "github") {
          if (user.email) {
            // 检查用户是否已存在
            const existingUser = await db.query.users.findFirst({
              where: eq(users.email, user.email),
            })

            if (existingUser) {
              // 更新用户的邮箱验证状态和信息
              await db.update(users)
                .set({ 
                  isEmailVerified: true,
                  emailVerified: new Date(),
                  username: user.name || existingUser.username,
                  image: user.image || existingUser.image,
                })
                .where(eq(users.email, user.email))
              
              // 更新user对象的id
              user.id = existingUser.id
            } else {
              // 创建新用户，注册赠送20积分
              const [newUser] = await db.insert(users).values({
                email: user.email,
                username: user.name,
                image: user.image,
                isEmailVerified: true,
                emailVerified: new Date(),
                credits: 20,
              }).returning()
              
              // 记录注册赠送积分的活动
              try {
                await db.insert(userActivities).values({
                  userId: newUser.id,
                  type: 'registration_bonus',
                  description: 'credit_description.registration_bonus',
                  creditAmount: 20,
                  metadata: JSON.stringify({
                    source: 'registration_bonus',
                    provider: account?.provider,
                    email: newUser.email,
                    type: 'registration_bonus',
                  })
                });
              } catch (error) {
                console.error('记录OAuth注册积分活动失败:', error);
              }
              
              // 更新user对象的id
              user.id = newUser.id
            }
          }
        }
        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === 'development',
})

// 导出类型
export type { Session } from "next-auth" 