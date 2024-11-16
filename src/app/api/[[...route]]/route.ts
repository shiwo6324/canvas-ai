import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import images from './images';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

const routes = app.route('/images', images);

// 将 Hono 应用实例转换为 Next.js API 路由可以理解的格式。
export const GET = handle(app);

// 导出路由类型，用于客户端类型推导
export type AppType = typeof routes;
