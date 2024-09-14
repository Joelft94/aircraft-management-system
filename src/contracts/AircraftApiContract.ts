export const AircraftApiContract = {
    create: {
      method: 'POST',
      path: '/api/aircraft',
      requestBody: {
        type: 'object',
        properties: {
          registration: { type: 'string' },
          model: { type: 'string' },
          owner: { type: 'string' },
          total_flight_hours: { type: 'number', minimum: 0 }
        },
        required: ['registration', 'model', 'owner', 'total_flight_hours']
      },
      responses: {
        201: {
          description: 'Created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  registration: { type: 'string' },
                  model: { type: 'string' },
                  owner: { type: 'string' },
                  total_flight_hours: { type: 'number' }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errors: { 
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    read: {
      method: 'GET',
      path: '/api/aircraft',
      parameters: {
        id: {
          in: 'query',
          schema: {
            type: 'number'
          },
          required: false
        }
      },
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    registration: { type: 'string' },
                    model: { type: 'string' },
                    owner: { type: 'string' },
                    total_flight_hours: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    },
    update: {
      method: 'PUT',
      path: '/api/aircraft',
      requestBody: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          registration: { type: 'string' },
          model: { type: 'string' },
          owner: { type: 'string' },
          total_flight_hours: { type: 'number', minimum: 0 }
        },
        required: ['id', 'registration', 'model', 'owner', 'total_flight_hours']
      },
      responses: {
        200: {
          description: 'Updated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  registration: { type: 'string' },
                  model: { type: 'string' },
                  owner: { type: 'string' },
                  total_flight_hours: { type: 'number' }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  errors: { 
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    delete: {
      method: 'DELETE',
      path: '/api/aircraft',
      parameters: {
        id: {
          in: 'query',
          schema: {
            type: 'number'
          },
          required: true
        }
      },
      responses: {
        200: {
          description: 'Deleted',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  };