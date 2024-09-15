'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

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

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('/api/flights');
      setFlights(response.data);
    } catch (err) {
      setError('Failed to fetch flights');
      console.error('Failed to fetch flights', err);
    }
  };

  const deleteFlight = async (id: number) => {
    try {
      await axios.delete(`/api/flights?id=${id}`);
      fetchFlights(); // Refresh the list after deletion
    } catch (err) {
      setError('Failed to delete flight');
      console.error('Failed to delete flight', err);
    }
  };

  return (
    <div>
      <h1>Flight List</h1>
      <Link href="/add-flight">Add New Flight</Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            Flight {flight.id}: {flight.aircraft_registration}, Pilot: {flight.pilot_name}, 
            Date: {new Date(flight.flight_date).toLocaleDateString()},
            Departure: {new Date(flight.departure_time).toLocaleString()}, 
            Arrival: {new Date(flight.arrival_time).toLocaleString()}, 
            Duration: {flight.duration} minutes, Type: {flight.flight_type}, Purpose: {flight.flight_purpose}
            <button onClick={() => deleteFlight(flight.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;