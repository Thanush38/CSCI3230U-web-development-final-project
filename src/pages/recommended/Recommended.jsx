//AI-assisted - see AI-USAGE.md
//Recommended Builds page: pick a goal, see the build, save it to the planner, and see more exercises for that goal from the API.
import { useState } from "react";
import { Link } from "react-router-dom";
import { builds } from "./builds";
import BuildTable from "./components/BuildTable";
import GoalExercises from "./components/GoalExercises";
import { saveBuildToPlanner } from "./saveToPlanner";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import "./Recommended.css";

function Recommended() {
  // The chosen goal is remembered in localStorage with the team's custom hook.
  const [selectedId, setSelectedId] = useLocalStorageState("recommendedGoal", "back");
  const [statusMessage, setStatusMessage] = useState("");

  // If the saved goal is missing or invalid, fall back to the first build.
  const selectedBuild = builds.find((build) => build.id === selectedId) ?? builds[0];

  const handleGoalChange = (e) => {
    setSelectedId(e.target.value);
    setStatusMessage("");
  };

  const handleSave = () => {
    saveBuildToPlanner(selectedBuild);
    setStatusMessage(`Saved "${selectedBuild.name}" to your Workout Planner.`);
  };

  return (
    <>
      <section id="goal-section">
        <h2>Choose Your Goal</h2>
        <label htmlFor="goal">Goal</label>
        <select id="goal" value={selectedBuild.id} onChange={handleGoalChange}>
          {builds.map((build) => (
            <option key={build.id} value={build.id}>
              {build.name}
            </option>
          ))}
        </select>
      </section>

      <section id="build" className="build">
        {/* aria-live: screen readers announce the new build when the goal changes */}
        <div aria-live="polite">
          <h2>Your Build: {selectedBuild.name}</h2>
          <p>{selectedBuild.explanation}</p>
        </div>

        <BuildTable exercises={selectedBuild.exercises} />

        <button type="button" onClick={handleSave}>
          Save to Workout Planner
        </button>
        <p role="status">{statusMessage}</p>
        {statusMessage && <Link to="/planner">Go to Workout Planner</Link>}
      </section>

      <GoalExercises goalId={selectedBuild.id} goalName={selectedBuild.name} />
    </>
  );
}

export default Recommended;