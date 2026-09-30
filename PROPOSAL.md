# CSCI 3230U - Final Project


### Team Members:
- Thanush Dinesh
- Cole Becker
- Nabeel Khan
- Kharintirasakar

#### Topic:
We will be making a web application that allows users to view different exercises and their details. The application will provide a list of exercises, and users can click on an exercise to view more information about it, such as the muscle groups it targets, equipment needed, instructions and visual images of it. This is for new gym beginners that are unsure what exercise hits what muscle and to give detailed images and instructions on how to perform it. Along with it we will have the option to filter the exercises based on muscle groups, equipment. Users can also build their own workout plan in the planner, or pick a goal on the recommended page and have the application generate a plan for them. Once they have a plan, the workout timer walks them through it with a countdown for each exercise and rest breaks in between.

#### Data Source:

**API:** ExerciseDB API (Free V1)
**Base URL:** `https://oss.exercisedb.dev/api/v1`


The free tier has 1,500+ exercises, each with an animated GIF's and step-by-step instructions on how to perform the exercise.
### Endpoints we'll use

| Endpoint | Used for |
| --- | --- |
| `GET /exercises` | List page, filtering, and generating workout plans |
| `GET /exercises/{exerciseId}` | Single exercise detail page |

The sample response is shown below.

```json
{
  "exerciseId": "EIeI8Vf",
  "name": "barbell bench press",
  "gifUrl": "https://static.exercisedb.dev/media/EIeI8Vf.gif",
  "targetMuscles": ["pectorals"],
  "bodyParts": ["chest"],
  "equipments": ["barbell"],
  "secondaryMuscles": ["triceps", "shoulders"],
  "instructions": [
    "Step:1 Lie flat on a bench with your feet flat on the ground...",
    "Step:2 Grasp the barbell with an overhand grip...",
    "Step:3 Lift the barbell off the rack..."
  ]
}
```

We will be using the following fields from the API response in our application:
| Field | Where it's used |
| --- | --- |
| `exerciseId` | Linking from the list page to the detail page |
| `name` | Exercise title on list cards and the detail page |
| `gifUrl` | Visual demonstration on the detail page and card thumbnails |
| `targetMuscles` | Detail page, muscle group filter, workout plan generator |
| `secondaryMuscles` | Detail page ("also works") |
| `bodyParts` | Body-part filter on the list page and grouping exercises for workout plans |
| `equipments` | Detail page and equipment filter |
| `instructions` | Step-by-step list on the detail page |

#### Comparators

| App | Site | What it does |
| --- | --- | --- |
| MuscleWiki | https://musclewiki.com/ | An interactive site where you click a muscle group to see videos of exercises that target it. Its core library is free, but many features are behind a paid premium subscription. |
| ExRx.net | https://exrx.net/ | A reference site with over 2,100 exercises organized by muscle group and the equipment you have available. |
| Muscle & Strength | https://www.muscleandstrength.com/ | A reference site where you can browse exercises and instructions for each muscle group, along with pre written workout programs. |

Our site is completely free, with no subscriptions or paid features. On top of letting users target the muscles they want, it also tells them which parts of their body they are neglecting, based on the workouts it creates for them. Users can also pick a physique or fitness goal, such as calisthenics, a bigger back, a bigger chest, or a pull-up target, and follow a plan built to reach it. When it is time to train, a built-in workout timer guides them through the plan one exercise at a time. None of these sites combines a workout builder, goal-based personalized guidance and a guided workout timer in one place.

#### Scaled Feature Plan:

##### Baseline features (required for every group)

These are the shared foundation of the app. Each one has an owner.

| Baseline feature | How it appears in our app | Owner |
| --- | --- | --- |
| React + Vite setup, app shell (header, nav, layout) | Shared layout used by every page | Thanush |
| Multiple routes with client-side routing | `/`, `/exercises`, `/exercises/:id`, `/planner`, `/recommended`, `/timer` | Thanush |
| Collection loaded from a web service | Shared data layer that fetches exercises from ExerciseDB and maps them to our own shape at the boundary | Everyone |
| Cards / list view | Exercise cards showing name, GIF, target muscle and equipment | Cole |
| Loading, error and empty states | Each page shows a spinner while loading, a message if the API fails, and "No exercises found" for empty results | Everyone (each on their own page) |
| Search | Search exercises by name or muscle group from the home page and the list page | Cole |
| Filter and sort | Filter by muscle group, equipment and body part; sort A–Z / Z–A or by muscle group | Cole |
| Detail view with URL params | `/exercises/:id` uses `exerciseId` to show target and secondary muscles, equipment, GIF and step-by-step instructions | Cole |
| Persisted user state (localStorage) | Saved goal and saved workout builds, stored with a custom hook + `localStorage` | Nabeel |
| Controlled form | Workout planner form (exercise, sets, time) controlled by React state | Kharintirasakar |
| Accessible and responsive | Semantic HTML, labelled controls, alt text, keyboard navigation, AA contrast, layouts that work on phones | Everyone |
| Automated tests | Tests for each person's own logic and components | Everyone |
| Deployed to a public URL | Hosted on Netlify | Everyone |

##### Vertical slices

Each member owns one page of the app and everything related to it: its components, state, data, route, tests and accessibility.

**Cole: Home page, exercise list and detail (`/`, `/exercises`, `/exercises/:id`)**
- **Home page:** A hero section, a search bar, muscle-group quick links and quick links to famous workout routines (e.g. Push/Pull/Legs, Upper/Lower). The famous routines are our own hard-coded data, since the API does not provide routines.
- **Search:** A search component that matches exercises by name or muscle group. It is used on the home page and on the list page. Searching from the home page takes the user to `/exercises?search=...` so results show up in the list.
- **List page:** A grid of exercise cards (name, GIF, target muscle, equipment) with filter controls for muscle group, equipment and body part, and a sort dropdown (A–Z, Z–A, by muscle group). Clicking a card opens the exercise's detail page.
- **Detail page:** `/exercises/:id` reads `exerciseId` from the URL and fetches that exercise. It shows the GIF, target and secondary muscles, equipment and numbered step-by-step instructions.
- **State / data:** Search text, filter and sort choices are kept in React state, with the search synced to the URL query string. Data comes from `GET /exercises` and `GET /exercises/{exerciseId}`.
- **Tests / a11y:** Tests for the search, filter and sort logic and the card component. The GIFs have alt text, the search and filters are labelled, and the cards can be reached with the keyboard.

**Nabeel: Recommended builds (`/recommended`)**
- **UI:** The user picks a physique or fitness goal (e.g. calisthenics, bigger back, bigger chest, pull-up target) and gets a generated workout build, with a short explanation of why each exercise fits the goal.
- **Neglected muscles:** Based on the planned workout, the planner shows which muscle groups are not being trained, so users can see what they are missing.
- **State / data:** The generated build uses exercises from the API chosen by their target muscles and body parts. The goal descriptions and explanations are our own written content. A custom hook saves the chosen goal and builds to `localStorage`.
- **Integration:** An "Apply to planner" button sends a build to the workout planner.
- **Tests / a11y:** Tests for the build generator and the `localStorage` hook. Goal options are labelled controls, and the results are announced to screen readers.

**Kharintirasakar: Workout planner (`/planner`)**
- **UI:** A controlled form with dropdowns to add exercises with sets and time. There is a table of the planned workout, add and undo buttons, and prebuilt workouts to start from.
- **State / data:** The plan is kept in React state. Exercises for the dropdowns come from the API, and saved or applied builds come from the recommended page.
- **Stretch goals:** Estimated calories burned (the API has no calorie data, so this would be our own estimate) and a chart of the plan.
- **Integration:** A "Start workout" button sends the plan to the workout timer.
- **Tests / a11y:** Tests for the plan logic (add, undo, neglected-muscle check) and the form. Every input is labelled, and the table uses proper headers.

**Thanush: Workout timer (`/timer`) and app shell**
- **UI:** The user picks a workout at the top, either their plan from the planner or a popular preset (e.g. Push Day, Full Body). Below it, a circular countdown timer shows the current exercise and its time left, then switches to a rest break before the next exercise. Pause, resume, skip and stop buttons let the user control the workout or end it early, and an "Up next" line shows the following exercise.
- **State / data:** The timer's state (current exercise, time left, work or rest, paused) is managed with `useReducer`, and a `useEffect` interval handles the countdown. Workouts come from the planner or from our own hard-coded presets. Exercise names and GIFs come from the API.
- **App shell / routing:** The shared header, nav and layout used by every page, and client-side routing for all six routes.
- **Tests / a11y:** Tests for the timer logic (countdown, switching to rest, pause, skip, finishing). The time left is announced through an `aria-live` region, every control is a labelled button that works with the keyboard, and the progress ring has a text alternative.

All vertical slices will use the same API: **Base URL:** `https://oss.exercisedb.dev/api/v1` 

#### Wireframes:

**Home Page**

![Home page wireframe](img/HomeWireframe.png)

**Exercise Page**

![Exercise page wireframe](img/ExercisePage.png)

**Workout Planner**

![Workout planner wireframe](img/WorkoutPlanner.png)

**Recommended Builds**
[Recommended Builds wireframe] (img/)

**Workout Timer**

![Workout timer wireframe](img/WorkoutTimer.jpg)
