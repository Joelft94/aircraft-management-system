'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddFlight: React.FC = () => {
  const router = useRouter();
  const [newFlight, setNewFlight] = useState({
    aircraft_registration: '',
    pilot_name: '',
    flight_date: '',
    departure_time: '',
    arrival_time: '',
    duration: 0,
    flight_type: 'VFR' as 'IFR' | 'VFR',
    flight_purpose: 'Private' as 'Instruction' | 'Test' | 'Charter' | 'Private'
  });
  const [error, setError] = useState<string | null>(null);

  const createFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/flights', newFlight);
      router.push('/flights');
    } catch (err) {
      setError('Failed to create flight');
      console.error('Failed to create flight', err);
    }
  };

  return (
    <div>
      <h1>Add New Flight</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={createFlight}>
        <input
          type="text"
          value={newFlight.aircraft_registration}
          onChange={(e) => setNewFlight({ ...newFlight, aircraft_registration: e.target.value })}
          placeholder="Aircraft Registration"
          required
        />
        <input
          type="text"
          value={newFlight.pilot_name}
          onChange={(e) => setNewFlight({ ...newFlight, pilot_name: e.target.value })}
          placeholder="Pilot Name"
          required
        />
        <input
          type="date"
          value={newFlight.flight_date}
          onChange={(e) => setNewFlight({ ...newFlight, flight_date: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={newFlight.departure_time}
          onChange={(e) => setNewFlight({ ...newFlight, departure_time: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={newFlight.arrival_time}
          onChange={(e) => setNewFlight({ ...newFlight, arrival_time: e.target.value })}
          required
        />
        <input
          type="number"
          value={newFlight.duration}
          onChange={(e) => setNewFlight({ ...newFlight, duration: parseInt(e.target.value) })}
          placeholder="Duration (minutes)"
          required
        />
        <select
          value={newFlight.flight_type}
          onChange={(e) => setNewFlight({ ...newFlight, flight_type: e.target.value as 'IFR' | 'VFR' })}
          required
        >
          <option value="IFR">IFR</option>
          <option value="VFR">VFR</option>
        </select>
        <select
          value={newFlight.flight_purpose}
          onChange={(e) => setNewFlight({ ...newFlight, flight_purpose: e.target.value as 'Instruction' | 'Test' | 'Charter' | 'Private' })}
          required
        >
          <option value="Instruction">Instruction</option>
          <option value="Test">Test</option>
          <option value="Charter">Charter</option>
          <option value="Private">Private</option>
        </select>
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
};

export default AddFlight;