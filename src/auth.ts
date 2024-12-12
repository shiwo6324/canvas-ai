import NextAuth, { DefaultSession } from 'next-auth';

import authConfig from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
