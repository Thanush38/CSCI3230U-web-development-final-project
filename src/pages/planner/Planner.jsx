import React, { useEffect } from 'react';
import './Planner.css';

function Planner(props) {
    useEffect(() => {
        const defaultPreBuiltWorkouts = {
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
            ]
        };

        if (!localStorage.getItem("savedPreBuiltWorkouts")) {
            localStorage.setItem("savedPreBuiltWorkouts", JSON.stringify(defaultPreBuiltWorkouts));
        }

        const preBuildSelect = document.getElementById('pre-buildInput');
        function populatePreBuiltDropdown() {
            if (!preBuildSelect) return;
            preBuildSelect.innerHTML = '<option value="" selected disabled>Select a pre-built workout</option>';
            
            const storedPreBuilts = JSON.parse(localStorage.getItem("savedPreBuiltWorkouts")) || {};
            Object.keys(storedPreBuilts).forEach(buildName => {
                const option = document.createElement('option');
                option.value = buildName;
                option.textContent = buildName;
                preBuildSelect.appendChild(option);
            });
        }
        populatePreBuiltDropdown();

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
            let buildWorkouts = null;

            if (isPreBuilt) {
                const storedPreBuilts = JSON.parse(localStorage.getItem("savedPreBuiltWorkouts")) || {};
                buildWorkouts = storedPreBuilts[buildName];
            } else {
                buildWorkouts = workoutBuilds[buildName];
            }

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
                            const newRow = document.createElement("tr");
                            newRow.innerHTML = `
                                <td>
                                    <select name="activity" aria-label="Exercise selection">
                                        <option value="${item.name}">${item.name}</option>
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
                const defaultSelect = table.querySelector("tr:nth-child(2) select");
                const selectOptionsHtml = defaultSelect ? defaultSelect.innerHTML : `<option value="Workout">Workout</option>`;
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
                const buildName = prompt("Enter a name for your saved workout build:");
                if (!buildName || buildName.trim() === "") {
                    alert("Build name cannot be empty.");
                    return;
                }

                const regimeRows = document.querySelectorAll('.workout-regime tbody tr');
                const workouts = [];

                regimeRows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 3) {
                        const setsMatch = cells[1].textContent.match(/(\d+)/);
                        const timeMatch = cells[2].textContent.match(/(\d+)/);

                        workouts.push({
                            name: cells[0].textContent.trim(),
                            sets: setsMatch ? setsMatch[1] : "3",
                            time: timeMatch ? timeMatch[1] : "10"
                        });
                    }
                });

                if (workouts.length === 0) {
                    alert("Your workout regime is empty! Add some workouts first.");
                    return;
                }

                const storedPreBuilts = JSON.parse(localStorage.getItem("savedPreBuiltWorkouts")) || {};
                storedPreBuilts[buildName.trim()] = workouts;
                localStorage.setItem("savedPreBuiltWorkouts", JSON.stringify(storedPreBuilts));

                populatePreBuiltDropdown();
                alert(`Successfully saved "${buildName.trim()}" to your pre-built workouts!`);
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
                <section className="workout-input pre-build">
                    <div className="control-group">
                        <label htmlFor="pre-buildInput">Pre-built Workout</label>
                        <select id="pre-buildInput" name="PreBuild Activity">
                            {/* Dynamically populated */}
                        </select>
                        <button type="button" id="preBuildAddBtn">Add</button>
                    </div>
                    
                    <div className="control-group">
                        <label htmlFor="reccInput">Recommended Build</label>
                        <select id="reccInput" name="Recommended Activity">
                            <option value="" defaultValue disabled>Select a recommended build</option>
                            <option value="Calisthenics">Calisthenics</option>
                            <option value="Bigger Back">Bigger Back</option>
                            <option value="Bigger Chest">Bigger Chest</option>
                            <option value="First Pull-Up">First Pull-Up</option>
                        </select>
                        <button type="button" id="reccAddBtn">Add</button>
                    </div>

                    <div id="links">
                        <h2>Table of Contents</h2>
                        <a href="#chest-input">Chest</a>
                        <a href="#back-input">Back</a>
                        <a href="#leg-input">Leg</a>
                        <a href="#shoulder-input">Shoulder</a>
                        <a href="#arm-input">Arm</a>
                        <a href="#core-input">Core</a>
                        <a href="#workout-regime">Workout Regime</a>
                    </div>
                </section>

                {/* Chest Section */}
                <section className="workout-input">
                    <h2 id="chest-input">Chest</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Workout</th>
                                    <th>Total Work Outs</th>
                                    <th>Time?</th> 
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select name="chestActivity" aria-label="Chest Exercise">
                                            <option value="Push-up">Push-up</option>
                                            <option value="Bench Press">Bench Press</option>
                                        </select>
                                    </td>
                                    <td><input type="text" name="chestSets" placeholder="Sets" aria-label="Chest sets" /></td>
                                    <td><input type="text" name="chestTime" placeholder="Minutes" aria-label="Chest time" /></td>
                                    <td><img className="imgPlaceholder" src="/workout-placeholder.svg" alt="Workout demonstration" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="add-btn">Add</button>
                    </div>
                </section>

                {/* Back Section */}
                <section className="workout-input">
                    <h2 id="back-input">Back</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Workout</th>
                                    <th>Total Work Outs</th>
                                    <th>Time?</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select name="backActivity" aria-label="Back Exercise">
                                            <option value="Pull-up">Pull-up</option>
                                            <option value="Bent-Over Row">Bent-Over Row</option>
                                        </select>
                                    </td>
                                    <td><input type="text" name="backSets" placeholder="Sets" aria-label="Back sets" /></td>
                                    <td><input type="text" name="backTime" placeholder="Minutes" aria-label="Back time" /></td>
                                    <td><img className="imgPlaceholder" src="/workout-placeholder.svg" alt="Workout demonstration" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="add-btn">Add</button>
                    </div>
                </section>

                {/* Leg Section */}
                <section className="workout-input">
                    <h2 id="leg-input">Leg</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Workout</th>
                                    <th>Total Work Outs</th>
                                    <th>Time?</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select name="legActivity" aria-label="Leg Exercise">
                                            <option value="Bodyweight Squat">Bodyweight Squat</option>
                                            <option value="Deadlift">Deadlift</option>
                                        </select>
                                    </td>
                                    <td><input type="text" name="legSets" placeholder="Sets" aria-label="Leg sets" /></td>
                                    <td><input type="text" name="legTime" placeholder="Minutes" aria-label="Leg time" /></td>
                                    <td><img className="imgPlaceholder" src="/workout-placeholder.svg" alt="Workout demonstration" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="add-btn">Add</button>
                    </div>
                </section>

                {/* Shoulder Section */}
                <section className="workout-input">
                    <h2 id="shoulder-input">Shoulder</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Workout</th>
                                    <th>Total Work Outs</th>
                                    <th>Time?</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select name="shoulderActivity" aria-label="Shoulder Exercise">
                                            <option value="Overhead Press">Overhead Press</option>
                                        </select>
                                    </td>
                                    <td><input type="text" name="shoulderSets" placeholder="Sets" aria-label="Shoulder sets" /></td>
                                    <td><input type="text" name="shoulderTime" placeholder="Minutes" aria-label="Shoulder time" /></td>
                                    <td><img className="imgPlaceholder" src="/workout-placeholder.svg" alt="Workout demonstration" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="add-btn">Add</button>
                    </div>
                </section>

                {/* Arm Section */}
                <section className="workout-input">
                    <h2 id="arm-input">Arm</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Workout</th>
                                    <th>Total Work Outs</th>
                                    <th>Time?</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select name="armActivity" aria-label="Arm Exercise">
                                            <option value="Bicep Curl">Bicep Curl</option>
                                            <option value="Tricep Dip">Tricep Dip</option>
                                        </select>
                                    </td>
                                    <td><input type="text" name="armSets" placeholder="Sets" aria-label="Arm sets" /></td>
                                    <td><input type="text" name="armTime" placeholder="Minutes" aria-label="Arm time" /></td>
                                    <td><img className="imgPlaceholder" src="/workout-placeholder.svg" alt="Workout demonstration" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="add-btn">Add</button>
                    </div>
                </section>

                {/* Core Section */}
                <section className="workout-input">
                    <h2 id="core-input">Core</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Workout</th>
                                    <th>Total Work Outs</th>
                                    <th>Time?</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select name="coreActivity" aria-label="Core Exercise">
                                            <option value="Plank">Plank</option>
                                        </select>
                                    </td>
                                    <td><input type="text" name="coreSets" placeholder="Sets" aria-label="Core sets" /></td>
                                    <td><input type="text" name="coreTime" placeholder="Minutes" aria-label="Core time" /></td>
                                    <td><img className="imgPlaceholder" src="/workout-placeholder.svg" alt="Workout demonstration" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="add-btn">Add</button>
                    </div>
                </section>

                <section className="workout-input">
                    <h2 id="workout-regime">Workout Regime</h2>
                    <div>
                        <table className="workout-regime">
                            <thead>
                                <tr>
                                    <th colSpan="4">Full Workout Regime</th>
                                </tr>
                                <tr>
                                    <th>Workout</th>
                                    <th>Total Work Outs</th>
                                    <th>Time?</th>
                                    <th>Complete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Dynamically populated */}
                            </tbody>
                        </table>
                        <div className="regime-actions">
                            <button type="button" id="backBtn">Back</button>
                            <button type="button" id="startTimerBtn">Start Timer</button>
                            <button type="button" id="saveBuildBtn">Save Build</button>
                        </div>
                    </div>
                </section>

                <section className="workout-input">
                    <h2 className="Results">Results</h2>
                    <p>Here we will insert a calculation formula to see how much calories were gained and lost</p>
                    <p>A possible graph may be shown</p>
                </section>
            </main>

            <footer id="copyright">Copyright &copy; 2026</footer>
        </>
    );
}

export default Planner;