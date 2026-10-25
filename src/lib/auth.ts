import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { Role } from "@/types/next-auth";

// Pre-defined demo users for testing & evaluation
export const MOCK_USERS = [
  {
    id: "usr_admin_01",
    email: "admin@techhub.vn",
    password: "Admin@123",
    name: "Quản trị viên (Admin)",
    role: "admin" as Role,
    avatar: "https://picsum.photos/seed/admin-avatar/200/200",
  },
  {
    id: "usr_user_02",
    email: "user@techhub.vn",
    password: "User@123",
    name: "Khách hàng Thân thiết (User)",
    role: "user" as Role,
    avatar: "https://picsum.photos/seed/user-avatar/200/200",
  },
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "super-secret-nextauth-key-ltwnc-week-8-production-ready-jwt",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // 1. Email/Password Authentication
    CredentialsProvider({
      id: "credentials",
      name: "Tài khoản Email & Mật khẩu",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@techhub.vn" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();
        const user = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.password === credentials.password
        );

        if (!user) {
          throw new Error("Email hoặc mật khẩu không chính xác!");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
        };
      },
    }),

    // 2. OAuth Provider: GitHub
    GithubProvider({
      clientId: process.env.GITHUB_ID || "mock-github-client-id",
      clientSecret: process.env.GITHUB_SECRET || "mock-github-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),

    // 3. OAuth Provider: Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // First sign in
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role || "user";
      }

      // Handle OAuth sign in role detection
      if (account && account.provider !== "credentials") {
        if (token.email === "admin@techhub.vn" || token.email?.startsWith("admin")) {
          token.role = "admin";
        } else if (!token.role) {
          token.role = "user";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as Role) || "user";
      }
      return session;
    },
  },
};

/**
 * Server-side helper to retrieve current authenticated session
 */
export async function getAuthSession() {
  return await getServerSession(authOptions);
}
