document.addEventListener("DOMContentLoaded", () => {
    // --- Data Mappings for Pre-built and Recommended Workouts ---
    const workoutBuilds = {
        // Pre-built workouts
        "Full Body Beginner": [
            { name: "Push-up", sets: "3", time: "10" },
            { name: "Bodyweight Squat", sets: "3", time: "10" },
            { name: "Plank", sets: "3", time: "5" }
        ],
        "Push / Pull / Legs": [
            { name: "Bench Press", sets: "4", time: "15" },
            { name: "Pull-up", sets: "4", time: "15" },
            { name: "Deadlift", sets: "3", time: "20" }
        ],
        "Upper / Lower Split": [
            { name: "Overhead Press", sets: "3", time: "10" },
            { name: "Bicep Curl", sets: "3", time: "10" },
            { name: "Bodyweight Squat", sets: "4", time: "15" }
        ],
        // Recommended builds
        "Calisthenics": [
            { name: "Push-up", sets: "4", time: "15" },
            { name: "Pull-up", sets: "3", time: "12" },
            { name: "Plank", sets: "3", time: "10" }
        ],
        "Bigger Back": [
            { name: "Pull-up", sets: "4", time: "15" },
            { name: "Bent-Over Row", sets: "4", time: "15" }
        ],
        "Bigger Chest": [
            { name: "Bench Press", sets: "4", time: "20" },
            { name: "Push-up", sets: "3", time: "10" }
        ],
        "First Pull-Up": [
            { name: "Pull-up", sets: "5", time: "10" },
            { name: "Bicep Curl", sets: "3", time: "10" }
        ]
    };

    // Map every exercise to its form input names and section category
    const exerciseMap = {
        "Push-up": { setsInput: "chestSets", timeInput: "chestTime" },
        "Bench Press": { setsInput: "chestSets", timeInput: "chestTime" },
        "Pull-up": { setsInput: "backSets", timeInput: "backTime" },
        "Bent-Over Row": { setsInput: "backSets", timeInput: "backTime" },
        "Bodyweight Squat": { setsInput: "legSets", timeInput: "legTime" },
        "Deadlift": { setsInput: "legSets", timeInput: "legTime" },
        "Overhead Press": { setsInput: "shoulderSets", timeInput: "shoulderTime" },
        "Bicep Curl": { setsInput: "armSets", timeInput: "armTime" },
        "Tricep Dip": { setsInput: "armSets", timeInput: "armTime" },
        "Plank": { setsInput: "coreSets", timeInput: "coreTime" }
    };

    const regimeTbody = document.querySelector(".workout-regime tbody");
    const resultsSection = document.querySelector(".Results");

    // --- Helper function to load builds into category inputs and regime table ---
    function loadWorkoutBuild(buildName) {
        let buildWorkouts = workoutBuilds[buildName];

        if (!buildWorkouts) {
            alert("Selected build not found.");
            return;
        }

        // 1. Reset all category input fields first
        Object.values(exerciseMap).forEach(mapping => {
            const setsInput = document.querySelector(`input[name="${mapping.setsInput}"]`);
            const timeInput = document.querySelector(`input[name="${mapping.timeInput}"]`);
            if (setsInput) setsInput.value = "";
            if (timeInput) timeInput.value = "";
        });

        // Clear any dynamically added extra rows (keeping index 0 as header, index 1 as the default input row)
        document.querySelectorAll(".workout-input table").forEach(table => {
            if (table.classList.contains("workout-regime")) return;
            const rows = table.querySelectorAll("tr");
            for (let i = 2; i < rows.length; i++) {
                rows[i].remove();
            }
        });

        // Track which category tables already used their default row
        const populatedTables = new Set();

        // 2. Populate the tables/inputs for the selected build
        buildWorkouts.forEach(item => {
            const mapping = exerciseMap[item.name];
            if (mapping) {
                const setsInput = document.querySelector(`input[name="${mapping.setsInput}"]`);
                const timeInput = document.querySelector(`input[name="${mapping.timeInput}"]`);

                if (setsInput && timeInput) {
                    const table = setsInput.closest("table");
                    
                    // If this table hasn't used its default row yet, fill it out
                    if (table && !populatedTables.has(table)) {
                        setsInput.value = item.sets;
                        timeInput.value = item.time;
                        const row = setsInput.closest("tr");
                        if (row && row.cells[0]) {
                            row.cells[0].textContent = item.name;
                        }
                        populatedTables.add(table);
                    } else if (table) {
                        // If the default row is already taken, append a new row to that table
                        const newRow = document.createElement("tr");
                        newRow.innerHTML = `
                            <td>${item.name}</td>
                            <td><input type="text" name="sets" value="${item.sets}" aria-label="${item.name} sets"></td>
                            <td><input type="text" name="time" value="${item.time}" aria-label="${item.name} time"></td>
                            <td><img class="imgPlaceholder" src="img/workout-placeholder.svg" alt="${item.name} demonstration"></td>
                        `;
                        table.appendChild(newRow);
                    }
                }
            }
        });

        // 3. Clear and update the Full Workout Regime table tbody
        if (regimeTbody) {
            regimeTbody.innerHTML = ""; // Clear existing rows

            buildWorkouts.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.sets} sets</td>
                    <td>${item.time} minutes</td>
                    <td><label><input type="checkbox" name="complete" class="regime-checkbox"> Complete?</label></td>
                `;
                regimeTbody.appendChild(row);
            });
            attachCheckboxListeners();
        }

        updateResults();
        alert(`Loaded "${buildName}" into your workout planner and regime!`);
    }

    // --- Event Listeners for Pre-built & Recommended Add Buttons ---
    const preBuildAddBtn = document.getElementById("preBuildAddBtn");
    if (preBuildAddBtn) {
        preBuildAddBtn.addEventListener("click", () => {
            const selectElem = document.getElementById("pre-buildInput");
            if (!selectElem || !selectElem.value) {
                alert("Please select a pre-built workout first.");
                return;
            }
            loadWorkoutBuild(selectElem.value);
        });
    }

    const reccAddBtn = document.getElementById("reccAddBtn");
    if (reccAddBtn) {
        reccAddBtn.addEventListener("click", () => {
            const selectElem = document.getElementById("reccInput");
            if (!selectElem || !selectElem.value) {
                alert("Please select a recommended build first.");
                return;
            }
            loadWorkoutBuild(selectElem.value);
        });
    }

    // --- Individual Muscle Section Dynamic Row Addition ---
    const addButtons = document.querySelectorAll(".workout-input .add-btn");
    addButtons.forEach(button => {
        button.addEventListener("click", () => {
            const section = button.closest(".workout-input");
            if (!section) return;

            const selectEl = section.querySelector("select");
            const table = section.querySelector("table");
            if (!selectEl || !table) return;

            const exerciseName = selectEl.value;
            const textInputs = table.querySelectorAll("input[type='text']");
            if (textInputs.length < 2) return;

            const setsVal = textInputs[0].value.trim();
            const timeVal = textInputs[1].value.trim();

            if (!setsVal || !timeVal) {
                alert("Please fill out both sets and time fields in the table.");
                return;
            }

            // Create a new row for the muscle section table
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${exerciseName}</td>
                <td><input type="text" name="sets" value="${setsVal}" aria-label="${exerciseName} sets"></td>
                <td><input type="text" name="time" value="${timeVal}" aria-label="${exerciseName} time"></td>
                <td><img class="imgPlaceholder" src="img/workout-placeholder.svg" alt="${exerciseName} demonstration"></td>
            `;
            table.appendChild(newRow);

            // Also append to Workout Regime table for unified tracking
            if (regimeTbody) {
                const regimeRow = document.createElement("tr");
                regimeRow.innerHTML = `
                    <td>${exerciseName}</td>
                    <td>${setsVal} sets</td>
                    <td>${timeVal} minutes</td>
                    <td><label><input type="checkbox" name="complete" class="regime-checkbox"> Complete?</label></td>
                `;
                regimeTbody.appendChild(regimeRow);
                attachCheckboxListeners();
            }

            // Reset the input fields
            textInputs[0].value = "";
            textInputs[1].value = "";
        });
    });

    // --- Calorie Calculation & Results Update ---
    function attachCheckboxListeners() {
        const checkboxes = document.querySelectorAll(".regime-checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.removeEventListener("change", updateResults);
            checkbox.addEventListener("change", updateResults);
        });
    }

    function updateResults() {
        const checkboxes = document.querySelectorAll(".regime-checkbox");
        let totalMinutes = 0;
        let completedCount = 0;

        checkboxes.forEach(cb => {
            if (cb.checked) {
                completedCount++;
                const row = cb.closest("tr");
                if (row && row.cells[2]) {
                    const timeText = row.cells[2].textContent;
                    const match = timeText.match(/(\d+)/);
                    const mins = match ? parseInt(match[1], 10) : 10;
                    totalMinutes += mins;
                }
            }
        });

        const caloriesBurned = totalMinutes * 8;

        if (resultsSection) {
            resultsSection.innerHTML = `
                <h2 class="Results">Results</h2>
                <p><strong>Workouts Completed:</strong> ${completedCount} / ${checkboxes.length}</p>
                <p><strong>Total Active Time:</strong> ${totalMinutes} minutes</p>
                <p><strong>Estimated Calories Burned:</strong> ${caloriesBurned} kcal</p>
            `;
        }
    }

    attachCheckboxListeners();

    // --- Timer Button Action ---
    const startTimerBtn = document.getElementById("startTimerBtn");
    if (startTimerBtn) {
        startTimerBtn.addEventListener("click", () => {
            alert("Redirecting to Workout Timer...");
            window.location.href = "workoutTimer.html";
        });
    }
});