import { NewWorkoutForm } from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Log New Workout</h1>
      <NewWorkoutForm />
    </div>
  );
}
