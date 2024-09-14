import { NextResponse } from 'next/server';
import { AircraftApiContract } from '../contracts/AircraftApiContract';

type SchemaProperty = {
  type: string;
  minimum?: number;
};

export function validateAircraft(data: any, action: 'create' | 'update') {
  const schema = AircraftApiContract[action].requestBody;
  const errors: string[] = [];

  for (const [key, value] of Object.entries(schema.properties as Record<string, SchemaProperty>)) {
    if (schema.required.includes(key) && (data[key] === undefined || data[key] === '')) {
      errors.push(`${key} is required`);
    } else if (data[key] !== undefined) {
      if (value.type === 'string' && typeof data[key] !== 'string') {
        errors.push(`${key} must be a string`);
      } else if (value.type === 'number' && typeof data[key] !== 'number') {
        errors.push(`${key} must be a number`);
      }
      if (value.type === 'number' && value.minimum !== undefined && data[key] < value.minimum) {
        errors.push(`${key} must be at least ${value.minimum}`);
      }
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return null;
}