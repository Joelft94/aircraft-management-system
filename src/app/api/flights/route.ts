import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface Flight {
  id: number;
  aircraft_registration: string;
  pilot_name: string;
  flight_date: string;
  departure_time: string;
  arrival_time: string;
  duration: number;
  flight_type: 'IFR' | 'VFR';
  flight_purpose: 'Instruction' | 'Test' | 'Charter' | 'Private';
}

export async function POST(request: Request) {
  try {
    const { aircraft_registration, pilot_name, flight_date, departure_time, arrival_time, duration, flight_type, flight_purpose } = await request.json();
    
    const newFlight = await pool.query(
      'INSERT INTO flights (aircraft_registration, pilot_name, flight_date, departure_time, arrival_time, duration, flight_type, flight_purpose) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [aircraft_registration, pilot_name, flight_date, departure_time, arrival_time, duration, flight_type, flight_purpose]
    );
    
    await updateAircraftHours(aircraft_registration, duration);

    return NextResponse.json(newFlight.rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Error creating flight' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const flight = await pool.query('SELECT * FROM flights WHERE id = $1', [id]);
      if (flight.rows.length === 0) {
        return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
      }
      return NextResponse.json(flight.rows[0]);
    } else {
      const allFlights = await pool.query('SELECT * FROM flights ORDER BY flight_date DESC, departure_time DESC');
      return NextResponse.json(allFlights.rows);
    }
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching flights' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, aircraft_registration, pilot_name, flight_date, departure_time, arrival_time, duration, flight_type, flight_purpose } = await request.json();
    
    const updatedFlight = await pool.query(
      'UPDATE flights SET aircraft_registration = $1, pilot_name = $2, flight_date = $3, departure_time = $4, arrival_time = $5, duration = $6, flight_type = $7, flight_purpose = $8 WHERE id = $9 RETURNING *',
      [aircraft_registration, pilot_name, flight_date, departure_time, arrival_time, duration, flight_type, flight_purpose, id]
    );

    if (updatedFlight.rows.length === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json(updatedFlight.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Error updating flight' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const result = await pool.query('DELETE FROM flights WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Flight deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Error deleting flight' }, { status: 500 });
  }
}

async function updateAircraftHours(registration: string, duration: number) {
  try {
    await pool.query(
      'UPDATE aircraft SET total_flight_hours = total_flight_hours + $1 WHERE registration = $2',
      [duration / 60, registration] // Convert duration from minutes to hours
    );
  } catch (err) {
    console.error('Error updating aircraft hours:', err);
  }
}