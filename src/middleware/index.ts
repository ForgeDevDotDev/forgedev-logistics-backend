import { Request, Response, NextFunction } from 'express';

// Simple error handler middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

// Request logger
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.path}`);
  next();
}

// TODO: Add auth middleware
// TODO: Add rate limiting — tracking endpoint is completely unprotected
// FIXME: Rate limiting should be applied to /tracking/:code at minimum
