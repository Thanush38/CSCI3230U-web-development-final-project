//give it a goal, and it gives back 4 real exercises from the API plus a status
import { useEffect, useState } from "react";
import { API, toExercise } from "../../exercises.js";

export const GOAL_BODY_PARTS = {
  calisthenics: ["chest", "back", "waist"],
  back: ["back"],
  chest: ["chest"],
  pullup: ["back", "upper arms"],
};

export function buildGoalUrl(goalId, limit = 4) {
  const params = new URLSearchParams({ limit });
  params.set("bodyParts", (GOAL_BODY_PARTS[goalId] ?? []).join(","));
  return `${API}?${params}`;
}

export default function useGoalExercises(goalId, limit = 4) {
  const [result, setResult] = useState({ key: null, exercises: [], error: false });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(buildGoalUrl(goalId, limit), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setResult({ key: goalId, exercises: (data.data ?? []).map(toExercise), error: false });
      } catch (error) {
        if (error.name === "AbortError") return;
        setResult({ key: goalId, exercises: [], error: true });
      }
    }

    load();
    
    return () => controller.abort();
  }, [goalId, limit]);

  const current = result.key === goalId;
  let status = "ok";
  if (!current) status = "loading";
  else if (result.error) status = "error";
  else if (result.exercises.length === 0) status = "empty";

  return { exercises: current ? result.exercises : [], status };
}