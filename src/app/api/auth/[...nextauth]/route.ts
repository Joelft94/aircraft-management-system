import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { JWT } from 'next-auth/jwt'
import { randomBytes } from "crypto"

const authPool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL,
})

export const authOptions: NextAuthOptions = {
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
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (session.user) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }