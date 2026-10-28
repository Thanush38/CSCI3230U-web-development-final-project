import React, { useEffect } from 'react';
import PreBuildControls from './PreBuildControls';
import WorkoutSection from './WorkoutSection';
import WorkoutRegime from './WorkoutRegime';
import PlannerResults from './PlannerResults';
import './Planner.css';

function Planner(props) {
    useEffect(() => {
        let storedPreBuilts = JSON.parse(localStorage.getItem("savedPreBuiltWorkouts")) || {};
        const legacyDefaults = ["Full Body Beginner", "Push / Pull / Legs", "Upper / Lower Split"];
        
        legacyDefaults.forEach(def => {
            delete storedPreBuilts[def];
        });
        
        localStorage.setItem("savedPreBuiltWorkouts", JSON.stringify(storedPreBuilts));

        const preBuildSelect = document.getElementById('pre-buildInput');
        function populatePreBuiltDropdown() {
            if (!preBuildSelect) return;
            preBuildSelect.innerHTML = '<option value="" selected disabled>Select a pre-built workout</option>';
            
            const currentPreBuilts = JSON.parse(localStorage.getItem("savedPreBuiltWorkouts")) || {};
            Object.keys(currentPreBuilts).forEach(buildName => {
                const option = document.createElement('option');
                option.value = buildName;
                option.textContent = buildName;
                preBuildSelect.appendChild(option);
            });
        }
        populatePreBuiltDropdown();

        const sectionOptionsMap = {
            chest: ['Push-up', 'Bench Press'],
            back: ['Pull-up', 'Bent-Over Row'],
            leg: ['Bodyweight Squat', 'Deadlift'],
            shoulder: ['Overhead Press'],
            arm: ['Bicep Curl', 'Tricep Dip'],
            core: ['Plank']
        };

        const workoutBuilds = {
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

        const exerciseMap = {
            "Push-up": { prefix: "chest", setsInput: "chestSets", timeInput: "chestTime" },
            "Bench Press": { prefix: "chest", setsInput: "chestSets", timeInput: "chestTime" },
            "Pull-up": { prefix: "back", setsInput: "backSets", timeInput: "backTime" },
            "Bent-Over Row": { prefix: "back", setsInput: "backSets", timeInput: "backTime" },
            "Bodyweight Squat": { prefix: "leg", setsInput: "legSets", timeInput: "legTime" },
            "Deadlift": { prefix: "leg", setsInput: "legSets", timeInput: "legTime" },
            "Overhead Press": { prefix: "shoulder", setsInput: "shoulderSets", timeInput: "shoulderTime" },
            "Bicep Curl": { prefix: "arm", setsInput: "armSets", timeInput: "armTime" },
            "Tricep Dip": { prefix: "arm", setsInput: "armSets", timeInput: "armTime" },
            "Plank": { prefix: "core", setsInput: "coreSets", timeInput: "coreTime" }
        };

        const regimeTbody = document.querySelector(".workout-regime tbody");
        const resultsSection = document.querySelector(".Results");

        if (regimeTbody) regimeTbody.innerHTML = "";

        let undoHistory = [];

        function saveStateSnapshot() {
            const snapshot = {
                muscleTables: [],
                regimeHtml: regimeTbody ? regimeTbody.innerHTML : ""
            };

            document.querySelectorAll(".workout-input table").forEach(table => {
                if (table.classList.contains("workout-regime")) return;
                snapshot.muscleTables.push({
                    tableElement: table,
                    html: table.innerHTML
                });
            });

            undoHistory.push(snapshot);
        }

        function getOptionsHtmlForPrefix(prefix) {
            const options = sectionOptionsMap[prefix] || ['Workout'];
            return options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        }

        function createEmptyRow(selectOptionsHtml) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <select name="activity" aria-label="Exercise selection">
                        ${selectOptionsHtml}
                    </select>
                </td>
                <td><input type="text" name="sets" placeholder="Sets" aria-label="Sets"></td>
                <td><input type="text" name="time" placeholder="Minutes" aria-label="Minutes"></td>
                <td><img class="imgPlaceholder" src="/workout-placeholder.svg" alt="demonstration"></td>
            `;
            return tr;
        }

        function loadWorkoutBuild(buildName, isPreBuilt = false) {
            let buildWorkouts = isPreBuilt 
                ? (JSON.parse(localStorage.getItem("savedPreBuiltWorkouts")) || {})[buildName] 
                : workoutBuilds[buildName];

            if (!buildWorkouts) {
                alert("Selected build not found.");
                return;
            }

            saveStateSnapshot();

            document.querySelectorAll(".workout-input table").forEach(table => {
                if (table.classList.contains("workout-regime")) return;
                
                const rows = table.querySelectorAll("tr");
                for (let i = 2; i < rows.length; i++) {
                    rows[i].remove();
                }

                const topInputs = rows[1]?.querySelectorAll("input[type='text']");
                if (topInputs) {
                    topInputs[0].value = "";
                    topInputs[0].removeAttribute("readonly");
                    topInputs[1].value = "";
                    topInputs[1].removeAttribute("readonly");
                }
            });

            const updatedTables = new Set();

            buildWorkouts.forEach(item => {
                const mapping = exerciseMap[item.name];
                if (mapping) {
                    const setsInput = document.querySelector(`input[name="${mapping.setsInput}"]`);
                    const timeInput = document.querySelector(`input[name="${mapping.timeInput}"]`);

                    if (setsInput && timeInput) {
                        const table = setsInput.closest("table");

                        if (table && !updatedTables.has(table)) {
                            setsInput.value = item.sets;
                            timeInput.value = item.time;
                            setsInput.setAttribute("readonly", true);
                            timeInput.setAttribute("readonly", true);

                            const row = setsInput.closest("tr");
                            const selectEl = row ? row.querySelector("select") : null;
                            if (selectEl) selectEl.value = item.name;

                            updatedTables.add(table);
                        } else if (table) {
                            const selectOptionsHtml = getOptionsHtmlForPrefix(mapping.prefix);

                            const newRow = document.createElement("tr");
                            newRow.innerHTML = `
                                <td>
                                    <select name="activity" aria-label="Exercise selection">
                                        ${selectOptionsHtml}
                                    </select>
                                </td>
                                <td><input type="text" name="sets" value="${item.sets}" aria-label="${item.name} sets" readonly></td>
                                <td><input type="text" name="time" value="${item.time}" aria-label="${item.name} time" readonly></td>
                                <td><img class="imgPlaceholder" src="/workout-placeholder.svg" alt="${item.name} demonstration"></td>
                            `;
                            table.appendChild(newRow);
                        }
                    }
                }
            });

            updatedTables.forEach(table => {
                const firstInput = table.querySelector("input[type='text']");
                let prefix = "chest";
                if (firstInput) {
                    const nameAttr = firstInput.getAttribute("name") || "";
                    prefix = nameAttr.replace("Sets", "").toLowerCase();
                }
                const selectOptionsHtml = getOptionsHtmlForPrefix(prefix);
                table.appendChild(createEmptyRow(selectOptionsHtml));
            });

            if (regimeTbody) {
                regimeTbody.innerHTML = "";
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

        const preBuildAddBtn = document.getElementById("preBuildAddBtn");
        if (preBuildAddBtn) {
            preBuildAddBtn.onclick = () => {
                if (!preBuildSelect || !preBuildSelect.value) {
                    alert("Please select a pre-built workout first.");
                    return;
                }
                loadWorkoutBuild(preBuildSelect.value, true);
            };
        }

        const reccAddBtn = document.getElementById("reccAddBtn");
        if (reccAddBtn) {
            reccAddBtn.onclick = () => {
                const selectElem = document.getElementById("reccInput");
                if (!selectElem || !selectElem.value) {
                    alert("Please select a recommended build first.");
                    return;
                }
                loadWorkoutBuild(selectElem.value, false);
            };
        }

        const addButtons = document.querySelectorAll(".workout-input .add-btn");
        addButtons.forEach(button => {
            button.onclick = () => {
                const section = button.closest(".workout-input");
                if (!section) return;

                const table = section.querySelector("table");
                if (!table) return;

                const rows = table.querySelectorAll("tr");
                const lastRow = rows[rows.length - 1];
                if (!lastRow) return;

                const selectEl = lastRow.querySelector("select");
                const textInputs = lastRow.querySelectorAll("input[type='text']");
                if (!selectEl || textInputs.length < 2) return;

                const setsVal = textInputs[0].value.trim();
                const timeVal = textInputs[1].value.trim();

                if (!setsVal || !timeVal) {
                    alert("Please fill out both sets and time fields in the table.");
                    return;
                }

                saveStateSnapshot();

                const exerciseName = selectEl.value;
                textInputs[0].setAttribute("readonly", true);
                textInputs[1].setAttribute("readonly", true);

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

                table.appendChild(createEmptyRow(selectEl.innerHTML));
                updateResults();
            };
        });

        const backBtn = document.getElementById("backBtn");
        if (backBtn) {
            backBtn.onclick = () => {
                if (undoHistory.length === 0) {
                    alert("Nothing to undo!");
                    return;
                }

                const previousState = undoHistory.pop();
                previousState.muscleTables.forEach(item => {
                    item.tableElement.innerHTML = item.html;
                });

                if (regimeTbody) {
                    regimeTbody.innerHTML = previousState.regimeHtml;
                    attachCheckboxListeners();
                }

                updateResults();
                alert("Successfully undone last action!");
            };
        }

        const saveBuildBtn = document.getElementById('saveBuildBtn');
        if (saveBuildBtn) {
            saveBuildBtn.onclick = () => {
                const nameInput = document.getElementById('buildNameInput');
                const buildName = nameInput ? nameInput.value.trim() : "";

                if (!buildName) {
                    alert("Please enter a name for your saved workout build in the input box first.");
                    if (nameInput) nameInput.focus();
                    return;
                }

                const regimeTable = document.getElementById('regime-table') || document.querySelector('table.workout-regime');
                const regimeRows = regimeTable ? regimeTable.querySelectorAll('tbody tr') : document.querySelectorAll('.workout-regime tbody tr');
                
                const workouts = [];

                regimeRows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 3) {
                        const name = cells[0].textContent.trim();
                        const setsText = cells[1].textContent;
                        const timeText = cells[2].textContent;

                        const setsMatch = setsText.match(/(\d+)/);
                        const timeMatch = timeText.match(/(\d+)/);

                        workouts.push({
                            name: name || "Workout",
                            sets: setsMatch ? setsMatch[1] : "3",
                            time: timeMatch ? timeMatch[1] : "10"
                        });
                    }
                });

                if (workouts.length === 0) {
                    alert("Your workout regime is empty! Add some workouts first.");
                    return;
                }

                const currentStored = JSON.parse(localStorage.getItem("savedPreBuiltWorkouts")) || {};
                currentStored[buildName] = workouts;
                localStorage.setItem("savedPreBuiltWorkouts", JSON.stringify(currentStored));

                populatePreBuiltDropdown();
                alert(`Successfully saved "${buildName}" to your pre-built workouts!`);
                if (nameInput) nameInput.value = "";
            };
        }

        function attachCheckboxListeners() {
            const checkboxes = document.querySelectorAll(".regime-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.onchange = updateResults;
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
    }, []);

    return (
        <>
            <header>
                <a className="logo" href="homePage.html">
                    <img src="/dumbbell.png" alt="WorkOnSite logo" />
                    WorkOnSite
                </a>
                <h1 id="Title">Workout Planner</h1>
                <nav>
                    <a href="homePage.html">Home</a>
                    <a href="workoutPlanner.html">Workout Planner</a>
                    <a href="recommendedBuilds.html">Recommended Builds</a>
                    <a href="workoutTimer.html">Workout Timer</a>
                </nav>
            </header>

            <main>
                <PreBuildControls />

                <WorkoutSection title="Chest" id="chest-input" options={["Push-up", "Bench Press"]} namePrefix="chest" />
                <WorkoutSection title="Back" id="back-input" options={["Pull-up", "Bent-Over Row"]} namePrefix="back" />
                <WorkoutSection title="Leg" id="leg-input" options={["Bodyweight Squat", "Deadlift"]} namePrefix="leg" />
                <WorkoutSection title="Shoulder" id="shoulder-input" options={["Overhead Press"]} namePrefix="shoulder" />
                <WorkoutSection title="Arm" id="arm-input" options={["Bicep Curl", "Tricep Dip"]} namePrefix="arm" />
                <WorkoutSection title="Core" id="core-input" options={["Plank"]} namePrefix="core" />

                <WorkoutRegime />
                <PlannerResults />
            </main>

            <footer id="copyright">Copyright &copy; 2026</footer>
        </>
    );
}

export default Planner;