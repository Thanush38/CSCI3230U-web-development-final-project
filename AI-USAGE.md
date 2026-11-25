## Log

### #1 - Generate Automated Tests for Testing Goals Page
- **Date:** 2026-11-20
- **Member:** Hayden Robinson
- **Tool / model:** co-pilot free with vs code
- **Files:** `src\pages\goals\Goals.test.jsx`
- **Prompt (verbatim):**

  ```
  Write tests to test the functionality of the goals app, it does not have to pass all test currently, no new features are expected, test functionality and structure
  ```

- **What it produced & what I changed:** Kept all code and changed none it works perfectly and tested most important things, other tests may be added later

### #2 - Fix Load Bugs
- **Date:** 2026-11-xx
- **Member:** Hayden Robinson
- **Tool / model:** co-pilot free with vs code
- **Files:** `src\pages\goals\hooks\useCompletedList.js`
- **Prompt (verbatim):**

  ```
  This code sometimes loads nothing instead of the badges on reload
  ```

- **What it produced & what I changed:** Turned a for-loop promise structure into the Promise.all structure


### #3 - Recommended Builds: Save to Planner, API Exercises and Tests
- **Date:** 2026-11-24
- **Member:** Nabeel Khan
- **Tool / model:** Claude (claude.ai)
- **Files:** `src\pages\recommended\Recommended.jsx`, `src\pages\recommended\Recommended.test.jsx`, `src\pages\recommended\useGoalExercises.js`, `src\pages\recommended\components\GoalExercises.jsx`
- **Prompt (verbatim):**

  ```
  Update my React Recommended page: remember the selected goal with our useLocalStorageState hook, add a "Save to Workout Planner" button using saveBuildToPlanner, and show GoalExercises below the build.
  Our proposal says the builds use exercises from the API. Should I implement that? Why aren't some of the exercise GIFs loading?
  help me write Vitest tests for my Recommended page and its helpers (saving to the planner, switching goals, API exercises). Mock fetch so tests don't use the network.
  ```

- **What it produced & what I changed:** Copied Recommended.jsx and Recommended.test.jsx as given. Typed the other files out by hand from the AI's code and rewrote the comments in my own words. Tested saving a build into the Workout Planner by hand, checked the API exercises load, and all 11 of my tests pass with npm test.

### #4 - Generated CSS for ExerciseCards and ExerciseDetails
- **Date:** 2026-11-24
- **Member:** Cole Becker
- **Tool / model:** free-tier assistant 
- **Files:** `src/ExerciseDetail.css`, `src/pages/home/Home.css`
- **Prompt (verbatim):**

  ```
  I pasted my jsx files for ExerciseCard and ExerciseDetail and asked it to write the css file for me to make it look nicer, as I'm bad with css.
  ```

- **What it produced & what I changed:** I kept it as it is. It made images consistant sizes, cleaner cards, a hover effect, and clearer text to make the names stand out. I verified how it looked and I liked how it turned out so that was the end of the prompt.