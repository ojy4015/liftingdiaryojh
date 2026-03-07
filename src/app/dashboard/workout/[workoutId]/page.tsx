import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById } from "../../../../../data/workouts";
import { formatDate } from "@/lib/format-date";
import { EditWorkoutForm } from "./edit-workout-form";

interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);

  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(id, userId);

  if (!workout) notFound();

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Workout</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Created {formatDate(workout.startedAt)}
        </p>
      </div>

      <EditWorkoutForm workout={workout} />
    </div>
  );
}
