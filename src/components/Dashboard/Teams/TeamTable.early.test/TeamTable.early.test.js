
// Unit tests for: TeamTable

import React from 'react'
import TeamTable from '../TeamTable';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

describe('TeamTable() TeamTable method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    test('renders table with active members', () => {
      // Arrange: Set up the members prop with active members
      const members = [
        {
          id: 1,
          status: 'ACTIVE',
          user: { name: 'John Doe', email: 'john@example.com' },
          role: 'Developer',
        },
        {
          id: 2,
          status: 'ACTIVE',
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          role: 'Designer',
        },
      ];

      // Act: Render the TeamTable component
      render(<TeamTable members={members} />);

      // Assert: Check if the table is rendered with the correct data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Designer')).toBeInTheDocument();
    });

    test('renders actions dropdown for each active member', () => {
      // Arrange: Set up the members prop with active members
      const members = [
        {
          id: 1,
          status: 'ACTIVE',
          user: { name: 'John Doe', email: 'john@example.com' },
          role: 'Developer',
        },
      ];

      // Act: Render the TeamTable component
      render(<TeamTable members={members} />);

      // Assert: Check if the actions dropdown is present
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('renders empty state when no members are provided', () => {
      // Arrange: Set up the members prop as an empty array
      const members = [];

      // Act: Render the TeamTable component
      render(<TeamTable members={members} />);

      // Assert: Check if the empty state message is displayed
      expect(screen.getByText('No active team members found')).toBeInTheDocument();
    });

    test('renders empty state when all members are inactive', () => {
      // Arrange: Set up the members prop with inactive members
      const members = [
        {
          id: 1,
          status: 'INACTIVE',
          user: { name: 'John Doe', email: 'john@example.com' },
          role: 'Developer',
        },
      ];

      // Act: Render the TeamTable component
      render(<TeamTable members={members} />);

      // Assert: Check if the empty state message is displayed
      expect(screen.getByText('No active team members found')).toBeInTheDocument();
    });

    test('handles members with missing user information gracefully', () => {
      // Arrange: Set up the members prop with a member missing user information
      const members = [
        {
          id: 1,
          status: 'ACTIVE',
          user: { name: '', email: '' },
          role: 'Developer',
        },
      ];

      // Act: Render the TeamTable component
      render(<TeamTable members={members} />);

      // Assert: Check if the placeholder is used for missing name
      expect(screen.getByText('?')).toBeInTheDocument();
    });
  });
});

// End of unit tests for: TeamTable
