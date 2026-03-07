# Data Mutations

## Overview

All data mutations follow a two-layer pattern:
1. **Helper functions** in `src/data/` wrap Drizzle ORM calls
2. **Server actions** in colocated `actions.ts` files call those helpers

---

## Layer 1: Data Helper Functions (`src/data/`)

All direct database writes (insert, update, delete) must live in helper functions inside `src/data/`. These functions are the only place that calls Drizzle ORM mutation methods.

### Rules

- One file per domain entity (e.g., `src/data/workouts.ts`, `src/data/exercises.ts`)
- Functions are plain async functions — not server actions
- Accept typed parameters, return typed results
- No validation logic here — that belongs in the server action layer

### Example

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(data: {
  userId: string;
  name: string;
  date: Date;
}) {
  const [workout] = await db.insert(workouts).values(data).returning();
  return workout;
}

export async function deleteWorkout(id: string) {
  await db.delete(workouts).where(eq(workouts.id, id));
}
```

---

## Layer 2: Server Actions (`actions.ts`)

All mutations triggered from the client must go through server actions defined in a colocated `actions.ts` file next to the page or component that uses them.

### Rules

- File must be named `actions.ts` and colocated with the feature (e.g., `src/app/workouts/actions.ts`)
- Must have `"use server"` at the top of the file
- Must **not** accept `FormData` as a parameter type — use explicit typed objects instead
- All parameters must be fully typed with TypeScript
- All arguments must be validated with **Zod** before any logic executes
- Call data helper functions from `src/data/` — never call Drizzle directly
- Return a typed result object (e.g., `{ success: true, data }` or `{ success: false, error: string }`)
- Must **not** call `redirect()` — navigation after a mutation is the caller's responsibility and must be handled client-side once the server action resolves

### Example

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  date: Date;
}) {
  const parsed = CreateWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }

  const workout = await createWorkout({
    userId: "...", // resolved from session/auth
    ...parsed.data,
  });

  return { success: true, data: workout };
}
```

---

## Summary of Rules

| Rule | Where |
|---|---|
| All DB mutation calls via Drizzle | `src/data/*.ts` only |
| All client-triggered mutations via server actions | `actions.ts` colocated with feature |
| No `FormData` parameter types | Server actions |
| All params explicitly typed | Server actions |
| All arguments validated with Zod | Server actions, before any logic |
| No direct Drizzle calls in server actions | Server actions call `src/data/` helpers |
| No `redirect()` calls | Server actions — redirect client-side after action resolves |
