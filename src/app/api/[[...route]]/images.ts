import { unsplash } from '@/lib/unsplash';
import { Hono } from 'hono';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_COLLECTION_IDS = ['317009'];

const app = new Hono().get('/', async (c) => {
  const images = await unsplash.photos.getRandom({
    count: DEFAULT_PAGE_SIZE,
    collectionIds: DEFAULT_COLLECTION_IDS,
  });
  if (images.errors) {
    return c.json(
      {
        error: images.errors[0],
      },
      400
    );
  }

  let responses = images.response;
  if (!Array.isArray(responses)) {
    responses = [responses];
  }

  return c.json({
    data: responses,
  });
});

export default app;
