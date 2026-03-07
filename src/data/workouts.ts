import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getWorkoutsByUserIdAndDate(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return db.query.workouts.findMany({
    where: (w, { eq, and, gte, lte }) =>
      and(eq(w.userId, userId), gte(w.startedAt, start), lte(w.startedAt, end)),
    orderBy: (w, { asc }) => asc(w.startedAt),
  });
}

export async function getWorkoutById(id: number, userId: string) {
  return db.query.workouts.findFirst({
    where: (w, { eq, and }) => and(eq(w.id, id), eq(w.userId, userId)),
  });
}

export async function createWorkoutHelper(data: {
  userId: string;
  name: string;
  startedAt: Date;
}) {
  const [workout] = await db.insert(workouts).values(data).returning();
  return workout;
}

export async function updateWorkout(
  id: number,
  userId: string,
  data: { name: string; startedAt: Date }
) {
  const [workout] = await db
    .update(workouts)
    .set({ name: data.name, startedAt: data.startedAt, updatedAt: new Date() })
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .returning();
  return workout ?? null;
}
