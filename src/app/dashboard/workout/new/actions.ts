"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createWorkoutHelper } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  startedAt: Date;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthenticated" } as const;
  }

  const parsed = CreateWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() } as const;
  }

  const workout = await createWorkoutHelper({
    userId,
    name: parsed.data.name,
    startedAt: parsed.data.startedAt,
  });

  return { success: true, data: workout } as const;
}
