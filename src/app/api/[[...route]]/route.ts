import { Context, Hono } from 'hono';
import { handle } from 'hono/vercel';
import images from './images';
import ai from './ai';
import users from './users';
// import type { AuthConfig } from '@auth/core/types';
import { initAuthConfig, AuthConfig } from '@hono/auth-js';
import authConfig from '@/auth.config';
export const runtime = 'nodejs';

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    ...authConfig,
  };
}

const app = new Hono().basePath('/api');

app.use('*', initAuthConfig(getAuthConfig));

const routes = app
  .route('/ai', ai)
  .route('/images', images)
  .route('/users', users);

// 将 Hono 应用实例转换为 Next.js API 路由可以理解的格式。
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// 导出路由类型，用于客户端类型推导
export type AppType = typeof routes;
