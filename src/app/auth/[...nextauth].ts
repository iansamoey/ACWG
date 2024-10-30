import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb'; // Make sure this path is correct
import { validateUser } from '@/lib/user';
import { IUser } from '@/models/User';

interface CustomUser {
  id: string;
  email: string;
  isAdmin?: boolean; // Optional property
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        try {
          const user: IUser = await validateUser(credentials.email, credentials.password);
          return {
            id: user._id.toString(),
            email: user.email,
            isAdmin: user.isAdmin, // Assuming isAdmin is part of your user model
          } as CustomUser;
        } catch (error) {
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'database', // Use database sessions instead of JWT
  },
  adapter: MongoDBAdapter(clientPromise), // No 'type' property needed
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id; // Set user id
        session.user.isAdmin = user.isAdmin; // Set isAdmin
      }
      return session; // Return the modified session
    },
    async signIn({ user }) {
      return true; // Allow sign in
    },
  },
};

export default NextAuth(authOptions);
