import { NextResponse } from 'next/server';

export function validateAircraft(data: any) {
  const errors = [];

  if (!data.registration || data.registration.trim() === '') {
    errors.push('Registration is required');
  }
  if (!data.model || data.model.trim() === '') {
    errors.push('Model is required');
  }
  if (!data.owner || data.owner.trim() === '') {
    errors.push('Owner is required');
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return null;
}