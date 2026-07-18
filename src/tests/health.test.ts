import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Health check', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});

// TODO: Add tests for order CRUD
// TODO: Add tests for delivery assignment
// TODO: Add tests for tracking endpoint
// TODO: Add tests for state machine transitions (once validation is added)
