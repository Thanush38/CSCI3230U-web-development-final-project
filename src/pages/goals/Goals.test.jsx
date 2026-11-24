import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, test, expect, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Goals from "./Goals.jsx";

function renderApp(route = "/goals") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Goals />
    </MemoryRouter>,
  );
}

// AI Generated Tests See: AI-USAGE.md #1

const exerciseResponse = {
  data: {
    bodyParts: ["chest"],
    equipments: ["dumbbell"],
    targetMuscles: ["pectorals"],
  },
};

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(exerciseResponse),
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Goals page structure", () => {
  test("renders the main page sections and goal form", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "Goals" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Achievements" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Create A Goal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Current Goals" })).toBeInTheDocument();

    expect(screen.getByLabelText("Goal Name:")).toBeRequired();
    expect(screen.getByLabelText("Starting Value")).toHaveValue(0);
    expect(screen.getByLabelText("Goal Value")).toHaveValue(100);
    expect(screen.getByRole("button", { name: "Add Goal" })).toBeInTheDocument();
  });

  test("loads an existing goal from localStorage", () => {
    localStorage.setItem(
      "goals",
      JSON.stringify([
        {
          id: "goal-1",
          name: "Run 5 km",
          info: "Build endurance",
          min: 0,
          max: 5,
          current: 2,
          logs: [],
        },
      ]),
    );

    renderApp();

    const goal = screen.getByRole("heading", { name: "Run 5 km" }).closest("article");
    expect(goal).toBeInTheDocument();
    expect(within(goal).getByText("Build endurance")).toBeInTheDocument();
    expect(within(goal).getByText("Progress: 2")).toBeInTheDocument();
  });
});

describe("goal functionality", () => {
  test("adds a valid goal and persists it", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText("Goal Name:"), "Bench 100 kg");
    await user.type(screen.getByLabelText("Goal Details:"), "Increase my press");
    await user.clear(screen.getByLabelText("Goal Value"));
    await user.type(screen.getByLabelText("Goal Value"), "100");
    await user.click(screen.getByRole("button", { name: "Add Goal" }));

    expect(screen.getByRole("heading", { name: "Bench 100 kg" })).toBeInTheDocument();
    expect(screen.getByText("Increase my press")).toBeInTheDocument();
    expect(screen.getByLabelText("Goal Name:")).toHaveValue("");

    const savedGoals = JSON.parse(localStorage.getItem("goals"));
    expect(savedGoals).toHaveLength(1);
    expect(savedGoals[0]).toMatchObject({
      name: "Bench 100 kg",
      info: "Increase my press",
      min: 0,
      max: 100,
      current: 0,
    });
    expect(savedGoals[0].logs).toHaveLength(1);
  });

  test("rejects goal values outside the allowed range", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    renderApp();

    await user.type(screen.getByLabelText("Goal Name:"), "Impossible goal");
    await user.clear(screen.getByLabelText("Starting Value"));
    await user.type(screen.getByLabelText("Starting Value"), "50");
    await user.clear(screen.getByLabelText("Goal Value"));
    await user.type(screen.getByLabelText("Goal Value"), "25");
    await user.click(screen.getByRole("button", { name: "Add Goal" }));

    expect(alertSpy).toHaveBeenCalledWith("Invalid data entered");
    expect(screen.queryByRole("heading", { name: "Impossible goal" })).not.toBeInTheDocument();
  });

  test("adds progress through the log form", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "goals",
      JSON.stringify([
        {
          id: "goal-1",
          name: "Walk",
          info: "Daily distance",
          min: 0,
          max: 10,
          current: 3,
          logs: [],
        },
      ]),
    );
    renderApp();

    await user.click(screen.getByRole("button", { name: "Update Goal" }));
    const goal = screen.getByRole("heading", { name: "Walk" }).closest("article");
    await user.type(within(goal).getByRole("spinbutton"), "6");
    await user.type(within(goal).getByRole("textbox"), "Long walk");
    await user.click(within(goal).getByRole("button", { name: "Submit" }));

    expect(within(goal).getByText("Progress: 6")).toBeInTheDocument();
    await user.click(within(goal).getByRole("button", { name: "Logs" }));
    expect(within(goal).getByText("Long walk")).toBeInTheDocument();
  });

  test("marks a goal complete and disables the complete button", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "goals",
      JSON.stringify([
        {
          id: "goal-1",
          name: "Read",
          info: "Read one book",
          min: 0,
          max: 1,
          current: 0,
          logs: [],
        },
      ]),
    );
    renderApp();

    await user.click(screen.getByRole("button", { name: "Mark As Complete" }));

    const completeButton = screen.getByRole("button", { name: "Completed" });
    expect(completeButton).toBeDisabled();
  });

  test("deletes a goal", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "goals",
      JSON.stringify([
        {
          id: "goal-1",
          name: "Temporary goal",
          info: "",
          min: 0,
          max: 10,
          current: 0,
          logs: [],
        },
      ]),
    );
    renderApp();

    await user.click(screen.getByRole("button", { name: "Delete Goal" }));

    expect(screen.queryByRole("heading", { name: "Temporary goal" })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("goals"))).toEqual([]);
  });
});

