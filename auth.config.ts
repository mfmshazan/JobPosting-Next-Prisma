import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// This config is used in middleware (Edge runtime) - no Prisma imports allowed
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig;
