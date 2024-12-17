import { verifyAuth } from '@hono/auth-js';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { projects, projectsSchema } from '@/db/schema';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
const app = new Hono()
  .patch(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      projectsSchema
        .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
        .partial()
    ),
    async (c) => {
      const auth = c.get('authUser');
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const project = await db
        .update(projects)
        .set({
          ...values,
          updatedAt: new Date(),
        })
        .where(
          and(eq(projects.userId, auth.token.id as string), eq(projects.id, id))
        )
        .returning();
      if (project.length === 0) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      return c.json({ data: project[0] });
    }
  )
  .get(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      const auth = c.get('authUser');
      const { id } = c.req.valid('param');
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const project = await db
        .select()
        .from(projects)
        .where(
          and(eq(projects.userId, auth.token.id as string), eq(projects.id, id))
        )
        .limit(1);
      if (project.length === 0) {
        return c.json({ error: '项目不存在' }, 404);
      }
      return c.json({ data: project[0] });
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      projectsSchema.pick({ name: true, json: true, width: true, height: true })
    ),
    async (c) => {
      const { name, json, width, height } = c.req.valid('json');
      const auth = c.get('authUser');

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const project = await db
        .insert(projects)
        .values({
          name: name,
          json: json,
          width: width,
          height: height,
          userId: auth.token.id as string,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      if (!project[0]) {
        return c.json({ error: 'Failed to create project' }, 400);
      }

      return c.json({ data: project });
    }
  );

export default app;
