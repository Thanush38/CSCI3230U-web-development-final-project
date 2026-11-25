//It converts a build into the planner's format 
//and adds it to the planner's saved workouts in localStorage without erasing what's already there.
import { SAVED_WORKOUTS_STORAGE_KEY, defaultExerciseMinutes } from "../../utils/timerAutoComplete";

//Turn the builds into the format the workout Planner reads.
//The planner stores total work minutes per exercise (2 minutes per set by default)
export function toPlannerWorkout(build) {
  return build.exercises.map((exercise) => ({
    name: exercise.name,
    sets: exercise.sets,
    time: defaultExerciseMinutes(exercise.sets),
  }));
}

//add a build to the planner's saved workouts in localStorage and keeping any workouts the user already saved
export function saveBuildToPlanner(build) {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(SAVED_WORKOUTS_STORAGE_KEY)) || {};
  } catch {
    saved = {};
  }

  const next = { ...saved, [build.name]: toPlannerWorkout(build) };
  localStorage.setItem(SAVED_WORKOUTS_STORAGE_KEY, JSON.stringify(next));
  return next;
}