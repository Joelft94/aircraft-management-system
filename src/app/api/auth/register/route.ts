import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const authPool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await authPool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}