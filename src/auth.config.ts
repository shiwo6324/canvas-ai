import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { users } from '@/db/schema';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { NextAuthConfig } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';
import { z } from 'zod';
import { db } from './db';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id?: string;
  }
}

const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(5, `Password must be more than 5 characters`)
    .max(15, `Password must be less than 15 characters`),
});

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = await signInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        // Check if the user exists in the database
        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        // Check if the query result is empty
        if (query.length === 0) {
          return null; // No user found with the given email
        }

        const user = query[0];
        const hashedPassword = user.password;

        if (!hashedPassword) {
          return null;
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(
          password,
          hashedPassword
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return user;
      },
    }),
  ],
  // Change default sign in and sign out pages
  pages: {
    // signIn: '/login',
    // signOut: '/logout',
    // error: '/login',
  },
  // Note: Credential authentication works only with jwt strategy
  // By default, auth.js uses database session strategy
  session: {
    strategy: 'jwt',
    // strategy: "database"
  },
  // The code below makes sure that the user id is stored in the session
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id;
      return session;
    },
  },
} satisfies NextAuthConfig;
