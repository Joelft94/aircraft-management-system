// src/app/api/aircraft/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { validateAircraft } from '@/middleware/validation';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateAircraft(data, 'create');
    if (validationError) return validationError;

    const { registration, model, owner, total_flight_hours } = data;
    const newAircraft = await pool.query(
      'INSERT INTO aircraft (registration, model, owner, total_flight_hours) VALUES ($1, $2, $3, $4) RETURNING *',
      [registration, model, owner, total_flight_hours]
    );
    return NextResponse.json(newAircraft.rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Error creating aircraft' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const aircraft = await pool.query('SELECT * FROM aircraft WHERE id = $1', [id]);
      if (aircraft.rows.length === 0) {
        return NextResponse.json({ error: 'Aircraft not found' }, { status: 404 });
      }
      return NextResponse.json(aircraft.rows[0]);
    } else {
      const allAircraft = await pool.query('SELECT * FROM aircraft');
      return NextResponse.json(allAircraft.rows);
    }
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching aircraft' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const validationError = validateAircraft(data, 'update');
    if (validationError) return validationError;

    const { id, registration, model, owner, total_flight_hours } = data;
    const updatedAircraft = await pool.query(
      'UPDATE aircraft SET registration = $1, model = $2, owner = $3, total_flight_hours = $4 WHERE id = $5 RETURNING *',
      [registration, model, owner, total_flight_hours, id]
    );

    if (updatedAircraft.rows.length === 0) {
      return NextResponse.json({ error: 'Aircraft not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAircraft.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Error updating aircraft' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const result = await pool.query('DELETE FROM aircraft WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Aircraft not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Aircraft deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Error deleting aircraft' }, { status: 500 });
  }
}