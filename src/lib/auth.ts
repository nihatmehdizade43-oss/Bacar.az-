// Purpose: NextAuth configuration with Credentials + Google providers.
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Use JWT sessions so middleware can reliably gate routes via getToken().
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) return null;

          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email.toLowerCase() },
          });

          if (!user?.passwordHash) return null;
          const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
    // Only register Google provider when credentials are actually set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth (Google), ensure user record exists with a role
      if (account?.provider === "google" && user?.email) {
        try {
          const existing = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
          });
          if (!existing) {
            // Auto-create user for Google sign-in
            await prisma.user.create({
              data: {
                email: user.email.toLowerCase(),
                name: user.name ?? "İstifadəçi",
                role: "user",
              },
            });
          }
        } catch (error) {
          console.error("Google signIn callback error:", error);
          // Don't block sign-in if user already exists via adapter
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "user";
      }
      // Ensure role is available after OAuth logins where `user` isn't present on every request.
      if (!token.role && token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true },
          });
          token.role = dbUser?.role ?? "user";
        } catch {
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub ?? "") as string;
        session.user.role = (token.role ?? "user") as string;
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
