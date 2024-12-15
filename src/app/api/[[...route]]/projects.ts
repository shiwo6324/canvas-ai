import { verifyAuth } from '@hono/auth-js';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { projects, projectsSchema } from '@/db/schema';
import { db } from '@/db';

const app = new Hono().post(
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
