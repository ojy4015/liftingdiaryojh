# Authentication

## Overview

This app uses **Clerk** for authentication. Clerk is the sole authentication provider — do not implement custom auth, sessions, JWTs, or any other auth mechanism.

---

## Getting the Authenticated User

### In Server Components and Server Actions

Use Clerk's `auth()` helper to retrieve the current session:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();

if (!userId) {
  // user is not authenticated
}
```

### In Client Components

Use Clerk's `useAuth` or `useUser` hooks:

```ts
import { useAuth } from "@clerk/nextjs";

const { userId, isSignedIn } = useAuth();
```

---

## Rules

- **Clerk is the only auth provider.** Do not use NextAuth, Auth.js, custom JWT logic, or any other auth library.
- **Never trust user-supplied IDs.** Always resolve the authenticated user's ID from `auth()` server-side — never from URL params, query strings, or request bodies.
- **Always guard server actions.** Every server action that operates on user data must call `auth()` at the top and return early (with an error result) if `userId` is null.
- **Always guard data helper calls.** Pass the `userId` resolved from `auth()` into data helper functions — never derive it from client input.
- **Do not use `redirect()` in server actions** (see `data-mutations.md`) — if the user is unauthenticated, return an error result and let the client handle navigation.

### Server Action Auth Guard Example

```ts
// src/app/workouts/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
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
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthenticated" };
  }

  const parsed = CreateWorkoutSchema.safeParse(params);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }

  const workout = await createWorkout({ userId, ...parsed.data });

  return { success: true, data: workout };
}
```

### Server Component Auth Example

```tsx
// src/app/workouts/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutsByUserId } from "@/data/workouts";

export default async function WorkoutsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const workouts = await getWorkoutsByUserId(userId);

  return <WorkoutList workouts={workouts} />;
}
```

> Note: `redirect()` is permitted in Server Components for unauthenticated route protection. It is only forbidden inside server actions (see `data-mutations.md`).

---

## Clerk Components

Use Clerk's pre-built UI components for sign-in/sign-up flows:

- `<SignIn />` — renders the sign-in form
- `<SignUp />` — renders the sign-up form
- `<UserButton />` — renders the user avatar/menu
- `<SignedIn>` / `<SignedOut>` — conditionally render content based on auth state

Do not build custom auth UI.

---

## Middleware

Clerk route protection is configured via `middleware.ts` at the project root using Clerk's `clerkMiddleware`. Public routes (e.g. `/sign-in`, `/sign-up`) must be explicitly marked as public; all other routes are protected by default.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

---

## Summary

| Concern | Rule |
|---|---|
| Auth provider | Clerk only |
| Resolve user ID server-side | `auth()` from `@clerk/nextjs/server` |
| Resolve user ID client-side | `useAuth()` hook |
| Never trust client-supplied user IDs | Always use `auth()` server-side |
| Guard every server action | Call `auth()` first, return error if unauthenticated |
| Auth UI | Clerk components only — no custom auth UI |
| Route protection | Clerk middleware via `clerkMiddleware` |
| `redirect()` for unauthenticated users | Permitted in Server Components, forbidden in server actions |
