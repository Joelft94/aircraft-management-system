// src/app/api/aircraft/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET() {
  try {
    const allAircraft = await pool.query('SELECT * FROM aircraft');
    return NextResponse.json(allAircraft.rows);
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching aircraft' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { registration, model, owner } = await request.json();
    const newAircraft = await pool.query(
      'INSERT INTO aircraft (registration, model, owner, total_flight_hours) VALUES ($1, $2, $3, $4) RETURNING *',
      [registration, model, owner, 0]
    );
    return NextResponse.json(newAircraft.rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Error creating aircraft' }, { status: 500 });
  }
}