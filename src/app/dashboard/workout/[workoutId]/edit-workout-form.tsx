"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateWorkoutAction } from "./actions";

interface Workout {
  id: number;
  name: string;
  startedAt: Date;
}

export function EditWorkoutForm({ workout }: { workout: Workout }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(workout.name);
  const [startedAt, setStartedAt] = useState(
    workout.startedAt.toISOString().slice(0, 16)
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateWorkoutAction(workout.id, {
        name,
        startedAt: new Date(startedAt),
      });

      if (!result.success) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Validation failed. Please check your inputs."
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Workout Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="startedAt" className="text-sm font-medium">
          Started At
        </label>
        <input
          id="startedAt"
          type="datetime-local"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
