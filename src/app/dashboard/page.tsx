import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getWorkoutsByUserIdAndDate } from "../../../data/workouts";
import { formatDate } from "@/lib/format-date";
import { DatePicker } from "./date-picker";

interface Props {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();

  const workouts = await getWorkoutsByUserIdAndDate(userId, date);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <DatePicker selected={date} />

      <a
        href="/dashboard/workout/new"
        className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
      >
        Log New Workout
      </a>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Workouts for {formatDate(date)}
        </h2>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          <ul className="space-y-2">
            {workouts.map((workout) => (
              <li
                key={workout.id}
                className="border rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <span className="font-medium">{workout.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(workout.startedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
