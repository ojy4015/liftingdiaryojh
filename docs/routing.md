# Routing

## Overview

All application routes live under `src/app/dashboard/`. The dashboard and all its sub-routes are protected and only accessible by authenticated users.

## Route Structure

```
src/app/
├── page.tsx              # Public landing/login page
├── layout.tsx            # Root layout
└── dashboard/
    ├── layout.tsx        # Dashboard layout (shared UI for all protected routes)
    ├── page.tsx          # Dashboard home (/dashboard)
    └── [feature]/
        └── page.tsx      # Feature sub-routes (/dashboard/[feature])
```

## Standards

### All routes go under `/dashboard`

Every page a logged-in user accesses must be a child of `src/app/dashboard/`. Do not create top-level app routes for authenticated content.

```
/dashboard          → src/app/dashboard/page.tsx
/dashboard/workouts → src/app/dashboard/workouts/page.tsx
/dashboard/profile  → src/app/dashboard/profile/page.tsx
```

### Route protection via Next.js Middleware

Authentication is enforced in `src/middleware.ts`. The middleware intercepts requests to `/dashboard` and all sub-paths and redirects unauthenticated users to the login page.

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = /* check session/token */

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

- Do not use per-page auth checks to protect routes — all protection is centralised in middleware.
- The middleware matcher must include `/dashboard/:path*` to cover all nested routes.

### Dashboard layout

`src/app/dashboard/layout.tsx` wraps all protected pages and should contain shared UI (navigation, sidebar, etc.). It can safely assume the user is authenticated.

### Public routes

Only routes outside `/dashboard` are public (e.g. the root `/` login/landing page). Keep public and protected routes strictly separated.
