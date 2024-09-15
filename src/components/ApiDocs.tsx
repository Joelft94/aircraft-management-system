// src/components/ApiDocs.tsx
import React from 'react';
import aircraftApiContract from '../contracts/aircraftApiContract.yaml';

const ApiDocs: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{aircraftApiContract.info.title}</h1>
      <p className="mb-4">{aircraftApiContract.info.description}</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Endpoints</h2>
      {Object.entries(aircraftApiContract.paths).map(([path, methods]) => (
        <div key={path} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{path}</h3>
          {Object.entries(methods as any).map(([method, details]) => (
            <div key={method} className="mb-4">
              <h4 className="text-lg font-medium mb-2">{method.toUpperCase()}</h4>
              <p>{(details as any).summary}</p>
              <h5 className="font-medium mt-2">Responses:</h5>
              <ul className="list-disc list-inside">
                {Object.entries((details as any).responses).map(([code, response]) => (
                  <li key={code}>
                    {code}: {(response as any).description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Schemas</h2>
      {Object.entries(aircraftApiContract.components.schemas).map(([name, schema]) => (
        <div key={name} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <ul className="list-disc list-inside">
            {Object.entries((schema as any).properties).map(([prop, details]) => (
              <li key={prop}>
                {prop}: {(details as any).type}
                {(details as any).description && ` - ${(details as any).description}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ApiDocs;