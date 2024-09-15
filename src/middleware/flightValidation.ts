// src/middleware/flightValidation.ts
import { NextResponse } from 'next/server';

export function validateFlight(data: any) {
  const errors: string[] = [];

  if (!data.aircraft_id || typeof data.aircraft_id !== 'number') {
    errors.push('Valid aircraft ID is required');
  }
  if (!data.pilot_id || typeof data.pilot_id !== 'number') {
    errors.push('Valid pilot ID is required');
  }
  if (!data.departure_time || !isValidDate(data.departure_time)) {
    errors.push('Valid departure time is required');
  }
  if (!data.arrival_time || !isValidDate(data.arrival_time)) {
    errors.push('Valid arrival time is required');
  }
  if (!data.duration || typeof data.duration !== 'number' || data.duration <= 0) {
    errors.push('Valid duration is required');
  }
  if (!['IFR', 'VFR'].includes(data.flight_type)) {
    errors.push('Flight type must be either IFR or VFR');
  }
  if (!['Instruction', 'Test', 'Charter', 'Private'].includes(data.flight_purpose)) {
    errors.push('Invalid flight purpose');
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return null;
}

function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}