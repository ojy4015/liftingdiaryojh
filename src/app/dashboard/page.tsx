"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/format-date";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_WORKOUTS = [
  { id: 1, name: "Bench Press", sets: 4, reps: 8, weight: 80 },
  { id: 2, name: "Squat", sets: 5, reps: 5, weight: 100 },
  { id: 3, name: "Deadlift", sets: 3, reps: 5, weight: 140 },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-60 justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? formatDate(date) : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                setDate(d);
                setOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Workouts for {formatDate(date)}
        </h2>

        {MOCK_WORKOUTS.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          <ul className="space-y-2">
            {MOCK_WORKOUTS.map((workout) => (
              <li
                key={workout.id}
                className="border rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <span className="font-medium">{workout.name}</span>
                <span className="text-sm text-muted-foreground">
                  {workout.sets} × {workout.reps} @ {workout.weight}kg
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
