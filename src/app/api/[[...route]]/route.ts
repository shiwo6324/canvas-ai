import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  });
});

// 将 Hono 应用实例转换为 Next.js API 路由可以理解的格式。
export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
