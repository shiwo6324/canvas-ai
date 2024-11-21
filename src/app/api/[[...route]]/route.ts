import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import images from './images';
import ai from './ai';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

const routes = app.route('/images', images).route('/ai', ai);

// 将 Hono 应用实例转换为 Next.js API 路由可以理解的格式。
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// 导出路由类型，用于客户端类型推导
export type AppType = typeof routes;
