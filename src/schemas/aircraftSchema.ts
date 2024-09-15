import { z } from 'zod';

export const aircraftSchema = z.object({
  registration: z.string().min(1, "Registration is required"),
  model: z.string().min(1, "Model is required"),
  owner: z.string().min(1, "Owner is required"),
  total_flight_hours: z.number().min(0, "Total flight hours must be non-negative")
});

export type AircraftInput = z.infer<typeof aircraftSchema>;