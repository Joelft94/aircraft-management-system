import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { JWT } from 'next-auth/jwt'
import {Session} from 'next-auth'

const authPool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL, // Remember to add this to your .env.local file
})

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const result = await authPool.query('SELECT * FROM users WHERE username = $1', [credentials.username])
        const user = result.rows[0]

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id.toString(), name: user.username, email: user.email }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        return {
          ...token,
          id: user.id
        }
      }
      return token
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string || undefined
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }