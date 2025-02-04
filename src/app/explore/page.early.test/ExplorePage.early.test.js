
// Unit tests for: ExplorePage

import React from 'react'
import { useUser } from "@auth0/nextjs-auth0/client";
import ExplorePage from '../page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mocking ProjectCard component
jest.mock("@/components/explore/ProjectCard", () => {
  return function ProjectCard({ project }) {
    return <div data-testid="project-card">{project.title}</div>;
  };
});

// Mocking Navbar component
jest.mock("@/components/explore/Navbar", () => {
  return function Navbar({ searchValue, onSearchChange }) {
    return (
      <input
        data-testid="navbar-search"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    );
  };
});

// Mocking useUser hook
jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn(),
}));

describe('ExplorePage() ExplorePage method', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { id: '1', name: 'Test User' } });
  });

  describe('Happy Paths', () => {
    it('should render loading spinner initially', () => {
      render(<ExplorePage />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render projects after fetching', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              projects: [
                { id: '1', title: 'Project 1' },
                { id: '2', title: 'Project 2' },
              ],
            },
          }),
        })
      );

      render(<ExplorePage />);
      await waitFor(() => expect(screen.getAllByTestId('project-card')).toHaveLength(2));
    });

    it('should filter projects based on search query', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              projects: [
                { id: '1', title: 'Project 1' },
                { id: '2', title: 'Another Project' },
              ],
            },
          }),
        })
      );

      render(<ExplorePage />);
      await waitFor(() => expect(screen.getAllByTestId('project-card')).toHaveLength(2));

      fireEvent.change(screen.getByTestId('navbar-search'), { target: { value: 'Another' } });
      expect(screen.getAllByTestId('project-card')).toHaveLength(1);
      expect(screen.getByText('Another Project')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should display no projects message when no projects match search', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              projects: [
                { id: '1', title: 'Project 1' },
                { id: '2', title: 'Another Project' },
              ],
            },
          }),
        })
      );

      render(<ExplorePage />);
      await waitFor(() => expect(screen.getAllByTestId('project-card')).toHaveLength(2));

      fireEvent.change(screen.getByTestId('navbar-search'), { target: { value: 'Nonexistent' } });
      expect(screen.queryByTestId('project-card')).not.toBeInTheDocument();
      expect(screen.getByText('No projects match your search.')).toBeInTheDocument();
    });

    it('should handle fetch error gracefully', async () => {
      global.fetch = jest.fn(() => Promise.reject('API is down'));

      render(<ExplorePage />);
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
      expect(screen.getByText('No projects match your search.')).toBeInTheDocument();
    });
  });
});

// End of unit tests for: ExplorePage
