import { z } from 'zod';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { replicate } from '@/lib/replicate';
import Replicate from 'replicate';

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

    // 构建 Replicate API 的输入参数
    const input = {
      width: 768,
      height: 768,
      prompt,
      scheduler: 'K_EULER',
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 50,
    };
    const model =
      'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478';
    const [output] = (await replicate.run(model, { input })) as any;
    const res = output.url();

    return c.json({ data: res.href });
  }
);

export default app;
