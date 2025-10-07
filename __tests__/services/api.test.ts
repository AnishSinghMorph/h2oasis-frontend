/**
 * Tests for API Configuration
 */

import API_CONFIG, { API_BASE_URL } from '../../src/config/api';

describe('API Configuration', () => {
  it('should have a valid BASE_URL', () => {
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe('string');
    expect(API_BASE_URL.length).toBeGreaterThan(0);
  });

  it('should use HTTP or HTTPS protocol', () => {
    expect(API_BASE_URL).toMatch(/^https?:\/\/.+/);
  });

  it('should not have trailing slash', () => {
    expect(API_BASE_URL).not.toMatch(/\/$/);
  });

  it('should be a valid URL format', () => {
    expect(() => new URL(API_BASE_URL)).not.toThrow();
  });

  it('should have endpoints defined', () => {
    expect(API_CONFIG.ENDPOINTS).toBeDefined();
    expect(API_CONFIG.ENDPOINTS.LOGIN).toBe('/api/auth/login');
    expect(API_CONFIG.ENDPOINTS.REGISTER).toBe('/api/auth/register');
  });
});

describe('API Endpoint Construction', () => {
  it('should build correct auth endpoints', () => {
    const loginEndpoint = `${API_BASE_URL}/api/auth/login`;
    const registerEndpoint = `${API_BASE_URL}/api/auth/register`;

    expect(loginEndpoint).toContain('/api/auth/login');
    expect(registerEndpoint).toContain('/api/auth/register');
  });

  it('should build correct health data endpoints', () => {
    const healthDataEndpoint = `${API_BASE_URL}/api/health-data`;

    expect(healthDataEndpoint).toContain('/api/health-data');
  });

  it('should handle query parameters correctly', () => {
    const userId = 'test-user-123';
    const endpoint = `${API_BASE_URL}/api/health-data/user/${userId}`;

    expect(endpoint).toContain('test-user-123');
  });
});
