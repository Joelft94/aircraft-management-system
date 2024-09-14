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
  const [newAircraft, setNewAircraft] = useState({
    registration: '',
    model: '',
    owner: '',
    total_flight_hours: 0
  });
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAircraft();
  }, []);

  const fetchAircraft = async () => {
    try {
      const response = await axios.get('/api/aircraft');
      setAircraft(response.data);
    } catch (err) {
      setError('Failed to fetch aircraft');
    }
  };

  const createAircraft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/aircraft', newAircraft);
      setNewAircraft({ registration: '', model: '', owner: '', total_flight_hours: 0 });
      fetchAircraft();
    } catch (err) {
      setError('Failed to create aircraft');
    }
  };

  const updateAircraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAircraft) {
      try {
        await axios.put('/api/aircraft', editingAircraft);
        setEditingAircraft(null);
        fetchAircraft();
      } catch (err) {
        setError('Failed to update aircraft');
      }
    }
  };

  const deleteAircraft = async (id: number) => {
    try {
      await axios.delete(`/api/aircraft?id=${id}`);
      fetchAircraft();
    } catch (err) {
      setError('Failed to delete aircraft');
    }
  };

  return (
    <div>
      <h1>Aircraft Management</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Add Aircraft</h2>
      <form onSubmit={createAircraft}>
        <input
          type="text"
          value={newAircraft.registration}
          onChange={(e) => setNewAircraft({ ...newAircraft, registration: e.target.value })}
          placeholder="Registration"
          required
        />
        <input
          type="text"
          value={newAircraft.model}
          onChange={(e) => setNewAircraft({ ...newAircraft, model: e.target.value })}
          placeholder="Model"
          required
        />
        <input
          type="text"
          value={newAircraft.owner}
          onChange={(e) => setNewAircraft({ ...newAircraft, owner: e.target.value })}
          placeholder="Owner"
          required
        />
        <input
          type="number"
          value={newAircraft.total_flight_hours}
          onChange={(e) => setNewAircraft({ ...newAircraft, total_flight_hours: parseInt(e.target.value) })}
          placeholder="Total Flight Hours"
          required
        />
        <button type="submit">Add Aircraft</button>
      </form>

      <h2>Aircraft List</h2>
      <ul>
        {aircraft.map((a) => (
          <li key={a.id}>
            {editingAircraft && editingAircraft.id === a.id ? (
              <form onSubmit={updateAircraft}>
                <input
                  type="text"
                  value={editingAircraft.registration}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, registration: e.target.value })}
                  required
                />
                <input
                  type="text"
                  value={editingAircraft.model}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, model: e.target.value })}
                  required
                />
                <input
                  type="text"
                  value={editingAircraft.owner}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, owner: e.target.value })}
                  required
                />
                <input
                  type="number"
                  value={editingAircraft.total_flight_hours}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, total_flight_hours: parseInt(e.target.value) })}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingAircraft(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {a.registration} - {a.model} - Owned by: {a.owner} - {a.total_flight_hours} hours
                <button onClick={() => setEditingAircraft(a)}>Edit</button>
                <button onClick={() => deleteAircraft(a.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Aircraft;