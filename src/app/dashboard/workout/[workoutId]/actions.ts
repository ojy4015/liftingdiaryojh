"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { updateWorkout } from "../../../../../data/workouts";

const UpdateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(
  workoutId: number,
  params: { name: string; startedAt: Date }
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthenticated" } as const;
  }

  const parsed = UpdateWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() } as const;
  }

  const workout = await updateWorkout(workoutId, userId, parsed.data);

  if (!workout) {
    return { success: false, error: "Workout not found" } as const;
  }

  return { success: true, data: workout } as const;
}
