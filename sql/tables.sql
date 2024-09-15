CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    aircraft_registration VARCHAR(50) REFERENCES aircraft(registration),
    pilot_id INTEGER,
    flight_date DATE NOT NULL,
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    duration INTEGER,
    flight_type VARCHAR(3) CHECK (flight_type IN ('IFR', 'VFR')),
    flight_purpose VARCHAR(20) CHECK (flight_purpose IN ('Instruction', 'Test', 'Charter', 'Private'))
);