import { UserRepoLocal } from '@/server/repositories/UserRepoLocal';
import { UserService } from '@/server/services/UserService';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const userService = new UserService(new UserRepoLocal());
        const userFound = await userService.checkUserCredentials(
          credentials.email,
          credentials.password
        );

        if ('error' in userFound) return null;

        return {
          id: userFound.email,
          email: userFound.email,
          name: userFound.firstName,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
