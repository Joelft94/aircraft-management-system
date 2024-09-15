export class ApiError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'ApiError';
    }
  }
  
  export function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
      return Response.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Unexpected error:', error);
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }