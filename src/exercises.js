export const API = "https://oss.exercisedb.dev/api/v1/exercises";

const categoryMap = {
    "chest": "chest",
    "back": "back",
    "upper legs": "legs",
    "lower legs": "legs",
    "shoulders": "shoulders",
    "upper arms": "arms",
    "lower arms": "arms",
    "waist": "core",
    "cardio": "cardio",
    "neck": "neck"
};

export function toExercise(exercise) {
    const bodyPart = exercise.bodyParts?.[0]?.toLowerCase() ?? "other";

    return {
        id: exercise.exerciseId,
        name: exercise.name,
        bodyParts: exercise.bodyParts,
        secondaryMuscle: (exercise.secondaryMuscles ?? []).join(", "),
        equipment: exercise.equipments,
        muscle: (exercise.targetMuscles ?? []).join(", "),
        category: categoryMap[bodyPart] ?? bodyPart,
        instructions: (exercise.instructions ?? []).join("\n\n"),
        gif: exercise.gifUrl
    };
}
// Home-page muscle group -> ExerciseDB bodyParts (comma-joined = OR on the API)
export const categoryToBodyParts = {
    chest: ["chest"],
    back: ["back"],
    legs: ["upper legs", "lower legs"],
    shoulders: ["shoulders"],
    arms: ["upper arms", "lower arms"],
    core: ["waist"]
};
