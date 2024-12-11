import { db } from '@/db';
import { users } from '@/db/schema';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const app = new Hono().post(
  '/',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
      password: z.string().min(5).max(15),
      name: z.string().min(2).max(15),
    })
  ),
  async (c) => {
    const { email, password, name } = c.req.valid('json');
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = await db.select().from(users).where(eq(users.email, email));
    if (query.length > 0) {
      return c.json({ error: '邮箱已存在' }, 400);
    }
    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    });

    return c.json(null, 200);
  }
);

export default app;
