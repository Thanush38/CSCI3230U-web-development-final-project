import { useState } from "react";
import { builds } from "./builds";
import BuildTable from "./components/BuildTable";
import "./Recommended.css";

function Recommended() {
  const [selectedId, setSelectedId] = useState("back");

  const selectedBuild = builds.find((build) => build.id === selectedId);

  return (
    <>
      <section id="goal-section">
        <h2>Choose Your Goal</h2>
        <label htmlFor="goal">Goal</label>
        <select
          id="goal"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {builds.map((build) => (
            <option key={build.id} value={build.id}>
              {build.name}
            </option>
          ))}
        </select>
      </section>

      <section id="build" className="build">
        <h2>Your Build: {selectedBuild.name}</h2>
        <p>{selectedBuild.explanation}</p>
        <BuildTable exercises={selectedBuild.exercises} />
      </section>
    </>
  );
}

export default Recommended;