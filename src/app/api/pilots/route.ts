import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { name, license_number, total_flight_hours } = await request.json();
    const newPilot = await pool.query(
      'INSERT INTO pilots (name, license_number, total_flight_hours) VALUES ($1, $2, $3) RETURNING *',
      [name, license_number, total_flight_hours]
    );
    return NextResponse.json(newPilot.rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Error creating pilot' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const pilot = await pool.query('SELECT * FROM pilots WHERE id = $1', [id]);
      if (pilot.rows.length === 0) {
        return NextResponse.json({ error: 'Pilot not found' }, { status: 404 });
      }
      return NextResponse.json(pilot.rows[0]);
    } else {
      const allPilots = await pool.query('SELECT * FROM pilots');
      return NextResponse.json(allPilots.rows);
    }
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching pilots' }, { status: 500 });
  }
}

// Implement PUT and DELETE methods as needed