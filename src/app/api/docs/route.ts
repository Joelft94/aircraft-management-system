// src/app/api/docs/route.ts
import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aircraft Management System API',
      version: '1.0.0',
    },
  },
  apis: ['./src/contracts/*.yaml'], // path to API specs
};

const swaggerSpec = swaggerJsdoc(options);

function loadYamlFile(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(fileContents);
}

export async function GET() {
  const aircraftApiSpec = loadYamlFile('src/contracts/aircraftApiContract.yaml');
  return NextResponse.json(aircraftApiSpec);
}