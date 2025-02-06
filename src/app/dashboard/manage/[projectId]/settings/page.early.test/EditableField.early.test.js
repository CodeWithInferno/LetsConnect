
// Unit tests for: EditableField

import React from 'react'
import { EditableField } from '../page';
import { fireEvent, render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mock the Layout component
jest.mock("@/components/Dashboard/Layout", () => {
  return function MockLayout({ children }) {
    return <div>{children}</div>;
  };
});

// Test suite for EditableField component
describe('EditableField() EditableField method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    test('should display the label and value correctly when not editing', () => {
      render(<EditableField label="Project Title" value="My Project" onSave={jest.fn()} />);
      expect(screen.getByText('Project Title')).toBeInTheDocument();
      expect(screen.getByText('My Project')).toBeInTheDocument();
    });

    test('should enter edit mode when pencil icon is clicked', () => {
      render(<EditableField label="Project Title" value="My Project" onSave={jest.fn()} />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('should save the new value when check icon is clicked', () => {
      const onSaveMock = jest.fn();
      render(<EditableField label="Project Title" value="My Project" onSave={onSaveMock} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Project Title' } });
      fireEvent.click(screen.getByText('Check'));
      expect(onSaveMock).toHaveBeenCalledWith('New Project Title');
    });

    test('should cancel editing when X icon is clicked', () => {
      render(<EditableField label="Project Title" value="My Project" onSave={jest.fn()} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('X'));
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('should handle empty initial value', () => {
      render(<EditableField label="Project Title" value="" onSave={jest.fn()} />);
      expect(screen.getByText('Project Title')).toBeInTheDocument();
      expect(screen.getByText('')).toBeInTheDocument();
    });

    test('should handle saving an empty value', () => {
      const onSaveMock = jest.fn();
      render(<EditableField label="Project Title" value="My Project" onSave={onSaveMock} />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
      fireEvent.click(screen.getByText('Check'));
      expect(onSaveMock).toHaveBeenCalledWith('');
    });

    test('should handle rapid toggle between edit and view modes', () => {
      render(<EditableField label="Project Title" value="My Project" onSave={jest.fn()} />);
      const editButton = screen.getByRole('button');
      fireEvent.click(editButton);
      fireEvent.click(screen.getByText('X'));
      fireEvent.click(editButton);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});

// End of unit tests for: EditableField
