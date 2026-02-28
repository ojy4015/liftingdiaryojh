# UI Coding Standards

## Component Library

**ONLY shadcn/ui components are permitted in this project.**

- Do NOT create custom UI components
- Do NOT use any other component library (e.g. MUI, Chakra, Radix directly, Headless UI)
- Do NOT build bespoke styled `<div>`, `<button>`, `<input>`, etc. wrappers
- Every piece of UI must be composed from shadcn/ui components

If a required UI element is not yet installed, add it via the shadcn CLI:

```bash
npx shadcn@latest add <component-name>
```

Installed components live in `src/components/ui/` and must not be modified unless absolutely necessary to fix a shadcn bug.

---

## Date Formatting

All date formatting must use **date-fns**.

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use `format` together with `getDate` and a custom ordinal helper:

```ts
import { format, getDate } from "date-fns";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export function formatDate(date: Date): string {
  return `${ordinal(getDate(date))} ${ (date, "MMM yyyy")}`;
}
```

Place this utility in `src/lib/format-date.ts` and import it wherever a date needs to be displayed.

---

## Summary

| Concern        | Rule                                      |
| -------------- | ----------------------------------------- |
| UI components  | shadcn/ui only — no custom components     |
| Date library   | date-fns only                             |
| Date format    | `1st Sep 2025`, `2nd Aug 2025`, etc.      |
