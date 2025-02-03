
// Unit tests for: GET


import prisma from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import { GET } from '../route';




// Mocking dependencies
jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
  organization: {
    findUnique: jest.fn(),
  },
}));

jest.mock("@auth0/nextjs-auth0", () => ({
  getSession: jest.fn(),
}));

describe('GET() GET method', () => {
  let req;

  beforeEach(() => {
    req = {}; // Mock request object
  });

  describe('Happy paths', () => {
    it('should return onboardingNeeded: false when user and organization data are complete', async () => {
      // Arrange
      const session = { user: { email: 'test@example.com' } };
      getSession.mockResolvedValue(session);
      prisma.user.findUnique.mockResolvedValue({ organizationId: 1 });
      prisma.organization.findUnique.mockResolvedValue({
        slug: 'org-slug',
        logo: 'org-logo',
        industry: 'org-industry',
      });

      // Act
      const response = await GET(req);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ onboardingNeeded: false });
    });
  });

  describe('Edge cases', () => {
    it('should return 401 Unauthorized when session is not available', async () => {
      // Arrange
      getSession.mockResolvedValue(null);

      // Act
      const response = await GET(req);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(responseBody).toEqual({ error: 'Unauthorized' });
    });

    it('should return onboardingNeeded: true when user is not found', async () => {
      // Arrange
      const session = { user: { email: 'test@example.com' } };
      getSession.mockResolvedValue(session);
      prisma.user.findUnique.mockResolvedValue(null);

      // Act
      const response = await GET(req);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ onboardingNeeded: true });
    });

    it('should return onboardingNeeded: true when user has no organizationId', async () => {
      // Arrange
      const session = { user: { email: 'test@example.com' } };
      getSession.mockResolvedValue(session);
      prisma.user.findUnique.mockResolvedValue({ organizationId: null });

      // Act
      const response = await GET(req);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ onboardingNeeded: true });
    });

    it('should return onboardingNeeded: true when organization is not found', async () => {
      // Arrange
      const session = { user: { email: 'test@example.com' } };
      getSession.mockResolvedValue(session);
      prisma.user.findUnique.mockResolvedValue({ organizationId: 1 });
      prisma.organization.findUnique.mockResolvedValue(null);

      // Act
      const response = await GET(req);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ onboardingNeeded: true });
    });

    it('should return onboardingNeeded: true when organization data is incomplete', async () => {
      // Arrange
      const session = { user: { email: 'test@example.com' } };
      getSession.mockResolvedValue(session);
      prisma.user.findUnique.mockResolvedValue({ organizationId: 1 });
      prisma.organization.findUnique.mockResolvedValue({
        slug: null,
        logo: 'org-logo',
        industry: 'org-industry',
      });

      // Act
      const response = await GET(req);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ onboardingNeeded: true });
    });
  });
});

// End of unit tests for: GET
