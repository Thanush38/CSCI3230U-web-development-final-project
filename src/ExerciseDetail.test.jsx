import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ExerciseDetail from './ExerciseDetail';
import * as exerciseApi from './services/exerciseApi';

const SAMPLE_EXERCISES = [
  {
    id: 'ex-101',
    name: 'Barbell Bench Press',
    muscleGroup: 'chest',
    equipment: 'Barbell',
    sets: 4,
    time: 12,
    instructions: ['Lie flat on the bench.', 'Lower the bar to mid-chest and press up.'],
  },
];

function renderDetailAt(routePath) {
  return render(
    <MemoryRouter initialEntries={[routePath]}>
      <Routes>
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/planner" element={<div>Planner Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ExerciseDetail route component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and displays the exercise matching the :id param', async () => {
    vi.spyOn(exerciseApi, 'fetchExercises').mockResolvedValue(SAMPLE_EXERCISES);

    renderDetailAt('/exercises/ex-101');

    expect(screen.getByRole('status')).toHaveTextContent(/loading exercise details/i);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Barbell Bench Press' })).toBeInTheDocument();
    });

    expect(screen.getAllByText(/chest/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Barbell/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Lie flat on the bench\./i)).toBeInTheDocument();
  });

  it('shows a not-found message when no exercise matches :id', async () => {
    vi.spyOn(exerciseApi, 'fetchExercises').mockResolvedValue(SAMPLE_EXERCISES);

    renderDetailAt('/exercises/non-existent-id');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /exercise not found/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/non-existent-id/i)).toBeInTheDocument();
  });
});