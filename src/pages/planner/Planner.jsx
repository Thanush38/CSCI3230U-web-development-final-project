import './Planner.css';

function Planner(props) {
    return (
        <>
            <header>
                <a className="logo" href="homePage.html">
                    <img src="img/dumbbell.png" alt="WorkOnSite logo" />
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
                            {/* Options populated dynamically via JavaScript */}
                        </select>
                        <button type="button" id="preBuildAddBtn">Add</button>
                    </div>
                    
                    <div className="control-group">
                        <label htmlFor="reccInput">Recommended Build</label>
                        <select id="reccInput" name="Recommended Activity">
                            <option value="" selected disabled>Select a recommended build</option>
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
                                    <td><img className="imgPlaceholder" src="img/workout-placeholder.svg" alt="Workout demonstration" /></td>
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
                                    <td><img className="imgPlaceholder" src="img/workout-placeholder.svg" alt="Workout demonstration" /></td>
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
                                    <td><img className="imgPlaceholder" src="img/workout-placeholder.svg" alt="Workout demonstration" /></td>
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
                                    <td><img className="imgPlaceholder" src="img/workout-placeholder.svg" alt="Workout demonstration" /></td>
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
                                    <td><img className="imgPlaceholder" src="img/workout-placeholder.svg" alt="Workout demonstration" /></td>
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
                                    <td><img className="imgPlaceholder" src="img/workout-placeholder.svg" alt="Workout demonstration" /></td>
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
                                <tr>
                                    <td>Push ups</td>
                                    <td>15 sets</td>
                                    <td>30 minutes</td>
                                    <td><label><input type="checkbox" name="complete" className="regime-checkbox" /> Complete?</label></td>
                                </tr>
                                <tr>
                                    <td>Planks</td>
                                    <td>10 sets</td>
                                    <td>15 minutes</td>
                                    <td><label><input type="checkbox" name="complete" className="regime-checkbox" /> Complete?</label></td>
                                </tr>
                                <tr>
                                    <td>Bicep Curling</td>
                                    <td>2 sets</td>
                                    <td>20 minutes</td>
                                    <td><label><input type="checkbox" name="complete" className="regime-checkbox" /> Complete?</label></td>
                                </tr>
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