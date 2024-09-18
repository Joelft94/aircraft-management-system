-- Create the authentication database
CREATE DATABASE auth_db;

-- Connect to the authentication database
\c auth_db;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Create the main database
CREATE DATABASE aircraft_management;

-- Connect to the main database
\c aircraft_management;

-- Create the aircraft table
CREATE TABLE aircraft (
    id SERIAL PRIMARY KEY,
    registration VARCHAR(50) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    total_flight_hours NUMERIC(10, 2) DEFAULT 0,
    user_id VARCHAR(50)
);

-- Create the flights table
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    aircraft_id INTEGER REFERENCES aircraft(id),
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    flight_type VARCHAR(3) CHECK (flight_type IN ('IFR', 'VFR')),
    flight_purpose VARCHAR(20) CHECK (flight_purpose IN ('Instruction', 'Test', 'Charter', 'Private'))
);

