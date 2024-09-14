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
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);

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

  const updateAircraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAircraft) {
      await axios.put('/api/aircraft', editingAircraft);
      setEditingAircraft(null);
      fetchAircraft();
    }
  };

  const deleteAircraft = async (id: number) => {
    await axios.delete(`/api/aircraft?id=${id}`);
    fetchAircraft();
  };

  return (
    <div>
      <h1>Aircraft Management</h1>
      
      {/* Create Aircraft Form */}
        <h2>Add Aircraft</h2>
      <form onSubmit={createAircraft}>
        {/* ... (input fields for registration, model, owner) */}
        <input
          type="text"
          value={newAircraft.registration}
          onChange={(e) => setNewAircraft({ ...newAircraft, registration: e.target.value })}
          placeholder="Registration"
        />
        <input
          type="text"
          value={newAircraft.model}
          onChange={(e) => setNewAircraft({ ...newAircraft, model: e.target.value })}
          placeholder="Model"
        />
        <input
          type="text"
          value={newAircraft.owner}
          onChange={(e) => setNewAircraft({ ...newAircraft, owner: e.target.value })}
          placeholder="Owner"
        />
        {/* <input
          type="number"
          value={newAircraft.total_flight_hours}
          onChange={(e) => setNewAircraft({ ...newAircraft, total_flight_hours: parseInt(e.target.value) })}
          placeholder="Total Flight Hours" 
        /> We will add this if we want to add the aircraft with different flight hours*/}
        <button type="submit">Add Aircraft</button>
      </form>

      {/* Aircraft List */}
      <ul>
        {aircraft.map((a) => (
          <li key={a.id}>
            {editingAircraft && editingAircraft.id === a.id ? (
              <form onSubmit={updateAircraft}>
                {/* ... (input fields for editing) */}
                <input
                  type="text"
                  value={editingAircraft.registration}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, registration: e.target.value })}
                />
                <input
                  type="text"
                  value={editingAircraft.model}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, model: e.target.value })}
                />
                <input
                  type="text"
                  value={editingAircraft.owner}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, owner: e.target.value })}
                />
                <input
                  type="number"
                  value={editingAircraft.total_flight_hours}
                  onChange={(e) => setEditingAircraft({ ...editingAircraft, total_flight_hours: parseInt(e.target.value) })}
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditingAircraft(null)}>Cancel</button>
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