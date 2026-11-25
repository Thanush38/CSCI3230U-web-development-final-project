// AI-assisted - see AI-USAGE.md
// Tests for the Recommended Builds page and its helpers.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Recommended from "./Recommended";
import BuildTable from "./components/BuildTable";
import { builds } from "./builds";
import { toPlannerWorkout, saveBuildToPlanner } from "./saveToPlanner";
import { buildGoalUrl } from "./useGoalExercises";

const STORAGE_KEY = "savedPreBuiltWorkouts";
const backBuild = builds.find((build) => build.id === "back");
const chestBuild = builds.find((build) => build.id === "chest");

function renderPage() {
  return render(
    <MemoryRouter>
      <Recommended />
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  // Fake the API so tests never call the real internet.
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                exerciseId: "abc123",
                name: "test row",
                gifUrl: "",
                targetMuscles: ["lats"],
                bodyParts: ["back"],
              },
            ],
          }),
      })
    )
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("toPlannerWorkout", () => {
  it("converts a build into the planner's format", () => {
    const result = toPlannerWorkout(backBuild);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ name: "Pull-up", sets: 4, time: 10 });
  });
});

describe("saveBuildToPlanner", () => {
  it("saves a build under its name", () => {
    saveBuildToPlanner(backBuild);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved["Bigger Back"]).toHaveLength(4);
  });

  it("keeps workouts the user already saved", () => {
    const existing = { "My Workout": [{ name: "Plank", sets: 2, time: 5 }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    saveBuildToPlanner(chestBuild);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(saved["My Workout"]).toEqual(existing["My Workout"]);
    expect(saved["Bigger Chest"]).toHaveLength(3);
  });

  it("recovers if the saved data is broken", () => {
    localStorage.setItem(STORAGE_KEY, "not valid json");
    saveBuildToPlanner(backBuild);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved["Bigger Back"]).toHaveLength(4);
  });
});

describe("buildGoalUrl", () => {
  it("asks the API for the goal's body parts", () => {
    const url = buildGoalUrl("back");
    expect(url).toContain("bodyParts=back");
    expect(url).toContain("limit=4");
  });
});

describe("BuildTable", () => {
  it("shows one row per exercise plus the header row", () => {
    render(<BuildTable exercises={backBuild.exercises} />);
    expect(screen.getAllByRole("row")).toHaveLength(5);
    expect(screen.getByText("Deadlift")).toBeTruthy();
  });
});

describe("Recommended page", () => {
  it("shows Bigger Back by default", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Your Build: Bigger Back" })).toBeTruthy();
  });

  it("shows the chosen build when the goal changes", () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("Goal"), { target: { value: "chest" } });
    expect(screen.getByRole("heading", { name: "Your Build: Bigger Chest" })).toBeTruthy();
  });

  it("remembers the chosen goal in localStorage", () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("Goal"), { target: { value: "chest" } });
    expect(JSON.parse(localStorage.getItem("recommendedGoal"))).toBe("chest");
  });

  it("saves the build to the planner when Save is clicked", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Save to Workout Planner" }));

    expect(screen.getByText('Saved "Bigger Back" to your Workout Planner.')).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved["Bigger Back"]).toHaveLength(4);
  });

  it("shows exercises from the API with links to their detail pages", async () => {
    renderPage();
    const link = await screen.findByRole("link", { name: /test row/ });
    expect(link.getAttribute("href")).toBe("/exercises/abc123");
  });
});