import { describe, it } from 'bun:test';
import type { Context } from 'elysia';
import { Elysia } from 'elysia';
import { lcLogger } from '.';

const req = (path: string, requestInit?: RequestInit) =>
  new Request(`http://localhost:3000${path}`, requestInit);

const methods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
  'TRACE',
];
const status = [200, 201, 204, 400, 401, 403, 404, 500];

function handler({ set }: Context) {
  set.status = status[Math.floor(Math.random() * status.length)];
  return { message: 'API' };
}

describe('lc-elysia-logger', () => {
  const app = new Elysia()
    .use(lcLogger())
    .group('lc-elysia-logger', (api) =>
      api
        .get('/', handler)
        .post('/', handler)
        .put('/', handler)
        .delete('/', handler)
        .patch('/', handler)
        .options('/', handler)
        .head('/', handler)
    )
    .listen(3000);

  it('test', async () => {
    console.log('\n');
    methods.forEach(async (method) => {
      await app.handle(req('/lc-elysia-logger', { method }));
    });
    console.log('\n');
  });
});
