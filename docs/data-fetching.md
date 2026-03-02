# Data Fetching

## CRITICAL: Server Components Only

**ALL data fetching in this application MUST be done exclusively via React Server Components.**

The following are strictly forbidden:
- Route handlers (`src/app/api/`) for data fetching
- Client components (`"use client"`) fetching data directly
- `useEffect` + `fetch` patterns
- SWR, React Query, or any client-side data fetching library
- Any other mechanism besides Server Components

Data flows in one direction: **database → helper function → Server Component → UI**.

If a Client Component needs data, it must receive it as props from a parent Server Component.

## Database Access: Helper Functions Only

**ALL database queries MUST be performed through helper functions located in the `liftingdiaryojh/data/` directory.**

Rules:
- Never write database queries inline in a component — always call a helper function from `data/`
- Helper functions MUST use **Drizzle ORM** to query the database — **raw SQL is strictly forbidden**
- Helper functions should be focused, single-purpose, and named clearly (e.g., `getWorkoutsByUserId`, `getExerciseById`)

## User Data Isolation — CRITICAL SECURITY REQUIREMENT

**A logged-in user MUST only ever be able to access their own data.**

Every helper function that returns user-scoped data MUST:

1. Accept the authenticated user's ID as a parameter (or resolve it internally from the session)
2. Always filter queries by that user's ID — **never omit the user ID filter**
3. Never accept a user ID from untrusted input (e.g., query params, request body) without validating it matches the session user

Example of a correct helper function:

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsByUserId(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

Example of how a Server Component uses it:

```tsx
// src/app/workouts/page.tsx
import { getWorkoutsByUserId } from "@/data/workouts";
import { getAuthSession } from "@/lib/auth";

export default async function WorkoutsPage() {
  const session = await getAuthSession();
  const workouts = await getWorkoutsByUserId(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

**Never** pass a user ID from URL params, search params, or form data directly into a helper function without first verifying it matches the authenticated session user. Doing so would allow users to access each other's data.

## Summary

| Concern | Rule |
|---|---|
| Where to fetch data | Server Components only |
| How to query the database | Drizzle ORM via `data/` helper functions |
| Raw SQL | Forbidden |
| Route handlers for data | Forbidden |
| Client-side data fetching | Forbidden |
| User data isolation | Every query must be scoped to the authenticated user's ID |
