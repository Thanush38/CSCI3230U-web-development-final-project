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