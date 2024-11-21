import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { replicate } from '@/lib/replicate';

const app = new Hono().post(
  '/generate-image',
  zValidator(
    'json',
    z.object({
      prompt: z.string().min(3),
    })
  ),
  async (c) => {
    const { prompt } = c.req.valid('json');

    const output = await replicate.run(
      'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      { input: { prompt } }
    );

    const res = output as string[];

    return c.json({
      data: res[0],
    });
  }
);

export default app;
