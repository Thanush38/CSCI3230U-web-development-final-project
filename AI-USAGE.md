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

### #5 - Understanding and Resolving the main -> fix/final-fixes Merge Conflict
- **Date:** 2026-11-25
- **Member:** Thanush Dinesh
- **Tool / model:** ChatGPT (chat.openai.com)
- **Files:** `src/services/exerciseApi.js`, `src/pages/planner/ExerciseCatalog.jsx`, `src/pages/planner/Planner.jsx`
- **Prompt (verbatim):**

  ```
  I merged main into fix/final-fixes and got merge conflicts in exerciseApi.js, ExerciseCatalog.jsx and Planner.jsx. Help me understand what each side changed and what the proposed solution should be.
  ```

- **What it produced & what I changed:** It explained that both branches changed the same planner and exercise code. Main added exercise GIFs and the shared search hook. My branch added saving the planner and syncing it with the timer. It suggested keeping both sides in each file instead of picking one. I checked each file to make sure nothing was lost, then staged them to finish the merge.

### #6 - Reading Workout Planner Builds from localStorage for the Timer
- **Date:** 2026-11-25
- **Member:** Thanush Dinesh
- **Tool / model:** ChatGPT (chat.openai.com)
- **Files:** `src/pages/timer/Timer.jsx`, `src/utils/timerAutoComplete.js`
- **Prompt (verbatim):**

  ```
  Look at how the workout builder (Planner) stores saved builds and the current regime so I can fetch them effectively for the timer.
  ```

- **What it produced & what I changed:** It went through the Planner and explained the localStorage keys it writes. Saved builds go in `savedPreBuiltWorkouts`. I wrote `loadSavedWorkouts()` and `toExercise()` in the timer to read the builds and convert them into timer steps.

Kharintirasakar Ai Usage:
I used ai mostly to give suggestions rather than writing code, however Ai did assist in a few functions, namely the functions invoveld with having checkboxes kept on to correspond with the wokrout timer. For example I asked ai for how to make the timer link and althoguh it did not write all codes it gave me starter code for the imports

### #7 Using it to help with image extraction in workout planner ###

- **Date:** 2026-11-25
- **Member:** Kharintirasaskar
- **Tool / model:** Gemini (chat.gemini.com)
- **Files:** `src/pages/planner/WorkoutSection.jsx`, `src/pages/timer.jsx`, `src/pages/Planner.jsx`, `src/utils/timerAutoComplete.js`
- **Prompt (verbatim): How would you use localstorage to make the status of the checkboxes and timer synced so that both the timer changes from the table and that the cheeckboxes in the table change from the timer. The second section I used ai for was for image collecting. I  used the prompt, which pathing would I need to implement and what methodeology would I use to receive the gifs. **

  ```
  How the timer can influence the workout tables chcked status and vice verse.
  ```


- **What it produced & what I changed:** `It produced variables names, ad the event listeners, however for the main changes themselves AI did not write it but rather explain how to do it and I implemented it. Furthermore I used ai to help with image extraction by asking it to suggest how to correclty path and receive the image files but made sure to impeemnt the main functoins itself. For example ai suggested using using the viarable gifForName and mapping it to the correct gifs which I implemented however ai helped me implement this onto the exercise image blocks. Overall the code was mostly handwritten aside from a few variables and tags which were commented on, such as ExerciseImage and Exercisegifmap but the other code was not ai generated. Ai was mainly used to learn how to implement properties rather than direclty write them in these prompts.`

