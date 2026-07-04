import { Request, Response, NextFunction } from 'express';

// Express error handling middleware must define all 4 arguments: (err, req, res, next)
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(`[SERVER ERROR] Path: ${req.path} | Method: ${req.method}`, err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}
