import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ExerciseDetail from './ExerciseDetail';
import { API } from './exercises.js';

// Raw ExerciseDB v1 shape returned by GET /exercises/:id
const SAMPLE_EXERCISE = {
  exerciseId: 'ila4NZS',
  name: 'Barbell Bench Press',
  bodyParts: ['chest'],
  targetMuscles: ['pectorals'],
  secondaryMuscles: ['triceps', 'shoulders'],
  equipments: ['barbell'],
  instructions: ['Lie flat on the bench.', 'Lower the bar to mid-chest and press up.'],
  gifUrl: 'https://example.com/bench.gif',
};

function mockFetchResponse({ ok = true, status = 200, body = {} } = {}) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });
}

function renderDetailAt(routePath) {
  return render(
    <MemoryRouter initialEntries={[routePath]}>
      <Routes>
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ExerciseDetail route component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the exercise by the :id param and displays its details', async () => {
    const fetchSpy = mockFetchResponse({ body: { data: SAMPLE_EXERCISE } });

    renderDetailAt('/exercises/ila4NZS');

    expect(screen.getByText(/loading exercise/i)).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Barbell Bench Press' })
    ).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledWith(`${API}/ila4NZS`, expect.anything());
    expect(screen.getByText('pectorals')).toBeInTheDocument();
    expect(screen.getByText('triceps, shoulders')).toBeInTheDocument();
    expect(screen.getByText('barbell')).toBeInTheDocument();
    expect(screen.getByText(/Lie flat on the bench\./i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Barbell Bench Press' })).toHaveAttribute(
      'src',
      SAMPLE_EXERCISE.gifUrl
    );
    expect(screen.getByRole('link', { name: /back to exercises/i })).toHaveAttribute('href', '/');
  });

  it('shows an error message when the API cannot find the exercise', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchResponse({ ok: false, status: 404 });

    renderDetailAt('/exercises/non-existent-id');

    expect(await screen.findByText(/could not load exercise/i)).toBeInTheDocument();
  });
});
