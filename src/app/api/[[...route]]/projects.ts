import { verifyAuth } from '@hono/auth-js';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { projects, projectsSchema } from '@/db/schema';
import { db } from '@/db';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
const app = new Hono()
  .delete(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid('param');
      const auth = c.get('authUser');
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .delete(projects)
        .where(
          and(eq(projects.userId, auth.token.id as string), eq(projects.id, id))
        )
        .returning();
      if (data.length === 0) {
        return c.json({ error: '项目不存在' }, 404);
      }
      return c.json({ data: { id } });
    }
  )
  .post(
    '/:id/duplicate',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid('param');
      const auth = c.get('authUser');
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .select()
        .from(projects)
        .where(
          and(eq(projects.id, id), eq(projects.userId, auth.token.id as string))
        );
      if (data.length === 0) {
        return c.json({ error: '项目不存在' }, 404);
      }
      const project = data[0];
      const newProject = await db
        .insert(projects)
        .values({
          name: project.name + '-副本',
          updatedAt: new Date(),
          createdAt: new Date(),
          json: project.json,
          userId: auth.token.id as string,
          width: project.width,
          height: project.height,
        })
        .returning();
      if (!newProject[0]) {
        return c.json({ error: '复制项目失败' }, 400);
      }
      return c.json({ data: newProject[0] });
    }
  )
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({ page: z.coerce.number(), limit: z.coerce.number() })
    ),
    async (c) => {
      const auth = c.get('authUser');
      const { page, limit } = c.req.valid('query');

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      // 查询数据库获取项目列表
      const data = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, auth.token.id as string)) //
        .limit(limit) // 限制返回数量
        .offset((page - 1) * limit) // 计算偏移量实现分页
        .orderBy(desc(projects.updatedAt)); // 按更新时间倒序排序

      // 返回项目列表和下一页信息
      return c.json({
        data,
        nextPage: data.length === limit ? page + 1 : null, // 如果返回数据等于limit说明还有下一页
      });
    }
  )
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
