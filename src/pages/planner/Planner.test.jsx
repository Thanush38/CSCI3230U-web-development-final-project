import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Planner from './Planner';
import * as exerciseApi from '../../services/exerciseApi';

const MOCK_EXERCISES = [
  {
    id: '1',
    name: 'Bench Press',
    muscleGroup: 'chest',
    equipment: 'Barbell',
    sets: 3,
    time: 10,
  },
  {
    id: '2',
    name: 'Pull-Up',
    muscleGroup: 'back',
    equipment: 'Bodyweight',
    sets: 3,
    time: 12,
  },
];

function renderPlanner() {
  return render(
    <MemoryRouter initialEntries={['/planner']}>
      <Planner />
    </MemoryRouter>
  );
}

describe('Workout Planner', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(exerciseApi, 'fetchExercises').mockResolvedValue(MOCK_EXERCISES);
  });

  it('filters catalog exercises by muscle group', async () => {
    const user = userEvent.setup();
    renderPlanner();

    const catalogHeading = await screen.findByRole('heading', { name: /exercise library/i });
    const catalogSection = catalogHeading.closest('section');

    await waitFor(() => {
      expect(within(catalogSection).getByText('Bench Press')).toBeInTheDocument();
      expect(within(catalogSection).getByText('Pull-Up')).toBeInTheDocument();
    });

    // Picking a muscle group searches ExerciseDB server-side (useExerciseSearch).
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            exerciseId: '2',
            name: 'Pull-Up',
            bodyParts: ['back'],
            equipments: ['body weight'],
            targetMuscles: ['lats'],
          },
        ],
        meta: { hasNextPage: false },
      }),
    });

    await user.selectOptions(screen.getByLabelText(/muscle group/i), 'back');

    expect(await within(catalogSection).findByText('Pull-Up')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('bodyParts=back'),
      expect.anything()
    );
    expect(within(catalogSection).queryByText('Bench Press')).not.toBeInTheDocument();
  });

  it('adds an exercise to the regime and persists it in localStorage', async () => {
    const user = userEvent.setup();
    renderPlanner();

    const catalogHeading = await screen.findByRole('heading', { name: /exercise library/i });
    const catalogSection = catalogHeading.closest('section');

    await waitFor(() => {
      expect(within(catalogSection).getByText('Bench Press')).toBeInTheDocument();
    });

    const addButtons = within(catalogSection).getAllByRole('button', { name: /add/i });
    await user.click(addButtons[0]);

    const regimeHeading = screen.getByRole('heading', { name: /workout regime/i });
    const regimeSection = regimeHeading.closest('section');

    expect(within(regimeSection).getByText('Bench Press')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('plannerRegimeItems'))).toHaveLength(1);
  });

  it('clears the planner after saving a build', async () => {
    const user = userEvent.setup();
    renderPlanner();

    const catalogHeading = await screen.findByRole('heading', { name: /exercise library/i });
    const catalogSection = catalogHeading.closest('section');

    await waitFor(() => {
      expect(within(catalogSection).getByText('Bench Press')).toBeInTheDocument();
    });

    const addButtons = within(catalogSection).getAllByRole('button', { name: /add/i });
    await user.click(addButtons[0]);

    await user.type(screen.getByLabelText(/build name/i), 'My Build');
    await user.click(screen.getByRole('button', { name: /save build/i }));

    const regimeHeading = screen.getByRole('heading', { name: /workout regime/i });
    const regimeSection = regimeHeading.closest('section');

    expect(within(regimeSection).queryByText('Bench Press')).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('plannerRegimeItems'))).toEqual([]);
    expect(JSON.parse(window.localStorage.getItem('savedPreBuiltWorkouts'))['My Build']).toHaveLength(1);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });
});