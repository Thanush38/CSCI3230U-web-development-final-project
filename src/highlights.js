// Curated "Popular Exercises" shown on the home page before the user searches.
// IDs are real ExerciseDB ids so each card links to the live detail page,
// but listing them here means the home page costs zero API requests.
const gif = (id) => `https://static.exercisedb.dev/media/${id}.gif`;

export const highlights = [
    { id: 'ila4NZS', name: 'Barbell Deadlift', muscle: 'glutes' },
    { id: 'EIeI8Vf', name: 'Barbell Bench Press', muscle: 'pectorals' },
    { id: 'qXTaZnJ', name: 'Barbell Full Squat', muscle: 'glutes' },
    { id: 'Kyd9Rz5', name: 'Barbell Military Press', muscle: 'deltoids' },
    { id: 'lBDjFxJ', name: 'Pull-Up', muscle: 'latissimus dorsi' },
    { id: 'I4hDWkc', name: 'Push-Up', muscle: 'pectorals' },
    { id: 'NbVPDMW', name: 'Dumbbell Biceps Curl', muscle: 'biceps' },
    { id: 'bZq4bwK', name: 'Weighted Triceps Dips', muscle: 'triceps' },
    { id: 'eZyBC3j', name: 'Barbell Bent Over Row', muscle: 'upper back' },
    { id: 'CosupLu', name: 'Front Plank', muscle: 'abdominals' },
].map((e) => ({ ...e, gif: gif(e.id) }));
