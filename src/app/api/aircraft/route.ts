import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { validateAircraft } from '@/middleware/validation';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const aircraft = await pool.query('SELECT * FROM aircraft WHERE id = $1', [id]);
      return NextResponse.json(aircraft.rows[0] || {});
    } else {
      const allAircraft = await pool.query('SELECT * FROM aircraft');
      return NextResponse.json(allAircraft.rows);
    }
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching aircraft' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const data = await request.json();
      const validationError = validateAircraft(data);
      if (validationError) return validationError;
  
      const { registration, model, owner } = data;
      const newAircraft = await pool.query(
        'INSERT INTO aircraft (registration, model, owner, total_flight_hours) VALUES ($1, $2, $3, $4) RETURNING *',
        [registration, model, owner, 0]
      );
      return NextResponse.json(newAircraft.rows[0], { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: 'Error creating aircraft' }, { status: 500 });
    }
  }

export async function PUT(request: Request) {
  try {
    const { id, registration, model, owner, total_flight_hours } = await request.json();
    const updatedAircraft = await pool.query(
      'UPDATE aircraft SET registration = $1, model = $2, owner = $3, total_flight_hours = $4 WHERE id = $5 RETURNING *',
      [registration, model, owner, total_flight_hours, id]
    );
    return NextResponse.json(updatedAircraft.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Error updating aircraft' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await pool.query('DELETE FROM aircraft WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Aircraft deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Error deleting aircraft' }, { status: 500 });
  }
}