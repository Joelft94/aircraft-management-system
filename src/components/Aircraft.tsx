'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Aircraft {
  id: number;
  registration: string;
  model: string;
  owner: string;
  total_flight_hours: number;
}

const Aircraft: React.FC = () => {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [newAircraft, setNewAircraft] = useState({ registration: '', model: '', owner: '' });

  useEffect(() => {
    fetchAircraft();
  }, []);

  const fetchAircraft = async () => {
    const response = await axios.get('/api/aircraft');
    setAircraft(response.data);
  };

  const createAircraft = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/aircraft', newAircraft);
    setNewAircraft({ registration: '', model: '', owner: '' });
    fetchAircraft();
  };

  return (
    <div>
      <h1>Aircraft</h1>
      <form onSubmit={createAircraft}>
        <input
          type="text"
          placeholder="Registration"
          value={newAircraft.registration}
          onChange={(e) => setNewAircraft({ ...newAircraft, registration: e.target.value })}
        />
        <input
          type="text"
          placeholder="Model"
          value={newAircraft.model}
          onChange={(e) => setNewAircraft({ ...newAircraft, model: e.target.value })}
        />
        <input
          type="text"
          placeholder="Owner"
          value={newAircraft.owner}
          onChange={(e) => setNewAircraft({ ...newAircraft, owner: e.target.value })}
        />
        <button type="submit">Add Aircraft</button>
      </form>
      <ul>
        {aircraft.map((a) => (
          <li key={a.id}>
            {a.registration} - {a.model} - Owned by: {a.owner} - {a.total_flight_hours} hours
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Aircraft;