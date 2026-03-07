# Server Components

## Next.js Version

This project uses **Next.js 16**. Certain APIs that were synchronous in earlier versions are now **asynchronous** and must be awaited.

---

## Params and SearchParams MUST Be Awaited

In Next.js 16, `params` and `searchParams` props passed to pages and layouts are **Promises**. They must always be awaited before accessing their values.

### Rules

- Always type `params` and `searchParams` as `Promise<...>`
- Always `await` them before destructuring or accessing properties
- Never access properties directly from `params` or `searchParams` without awaiting

### Correct Usage

```tsx
// src/app/dashboard/workout/[workoutId]/page.tsx

interface Props {
  params: Promise<{ workoutId: string }>;
  searchParams: Promise<{ date?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { workoutId } = await params;
  const { date } = await searchParams;

  // ...
}
```

### Incorrect Usage — Do Not Do This

```tsx
// ❌ params is a Promise — do not destructure without awaiting
export default async function Page({ params }: { params: { workoutId: string } }) {
  const { workoutId } = params; // runtime error
}
```

---

## Summary

| Concern | Rule |
|---|---|
| `params` type | Always `Promise<{ ... }>` |
| `searchParams` type | Always `Promise<{ ... }>` |
| Accessing `params` / `searchParams` | Always `await` before use |
