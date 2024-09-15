import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { registration, model, owner } = await request.json();
    const newAircraft = await pool.query(
      'INSERT INTO aircraft (registration, model, owner, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [registration, model, owner, session.user.id]
    );
    return NextResponse.json(newAircraft.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating aircraft:', error);
    return NextResponse.json({ error: 'Failed to create aircraft' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const aircraft = await pool.query('SELECT * FROM aircraft WHERE id = $1 AND user_id = $2', [id, session.user.id]);
      if (aircraft.rows.length === 0) {
        return NextResponse.json({ error: 'Aircraft not found' }, { status: 404 });
      }
      return NextResponse.json(aircraft.rows[0]);
    } else {
      const allAircraft = await pool.query('SELECT * FROM aircraft WHERE user_id = $1', [session.user.id]);
      return NextResponse.json(allAircraft.rows);
    }
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    return NextResponse.json({ error: 'Failed to fetch aircraft' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, registration, model, owner } = await request.json();
    const updatedAircraft = await pool.query(
      'UPDATE aircraft SET registration = $1, model = $2, owner = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [registration, model, owner, id, session.user.id]
    );

    if (updatedAircraft.rows.length === 0) {
      return NextResponse.json({ error: 'Aircraft not found or you do not have permission to update it' }, { status: 404 });
    }

    return NextResponse.json(updatedAircraft.rows[0]);
  } catch (error) {
    console.error('Error updating aircraft:', error);
    return NextResponse.json({ error: 'Failed to update aircraft' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Aircraft ID is required' }, { status: 400 });
  }

  try {
    const result = await pool.query('DELETE FROM aircraft WHERE id = $1 AND user_id = $2 RETURNING *', [id, session.user.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Aircraft not found or you do not have permission to delete it' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Aircraft deleted successfully' });
  } catch (error) {
    console.error('Error deleting aircraft:', error);
    return NextResponse.json({ error: 'Failed to delete aircraft' }, { status: 500 });
  }
}