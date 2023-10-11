import { Elysia } from 'elysia';
import process from 'process';
import pc from 'picocolors';
import {
  formatDuration,
  formatRequestMethod,
  formatStatus,
} from './utils/formats';

/**
 * ---
 * @example
 * ```typescript
 * import { Elysia } from 'elysia';
 * import { lcLogger } from 'lc-elysia-logger';
 *
 * const app = new Elysia()
 *  .use(lcLogger())
 * .get('/', () => 'Hello Elysia')
 * .listen(3000);
 *
 * console.log(
 *  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
 * );
 * ```
 * @description
 * lc-elysia-logger es un middleware para Elysia que permite mostrar en la consola de comandos las peticiones que se realizan al servidor.
 */
export const lcLogger = () => {
  return new Elysia({
    name: 'lc-elysia-logger',
  })
    .onBeforeHandle((ctx) => {
      ctx.store = { beforeTime: process.hrtime(), ...ctx.store };
    })
    .onAfterHandle(({ request, store, ...more }) => {
      const logStr = [];
      const forwardedFor = request.headers.get('X-Forwarded-For');
      const method = formatRequestMethod(request.method, ' ✔ ');

      const status = formatStatus(more.set.status) ?? undefined;

      const urlPathname = new URL(request.url).pathname;
      const beforeTime = (store as any).beforeTime;

      if (forwardedFor) {
        logStr.push(`[${pc.cyan(forwardedFor)}]`);
      }

      logStr.push(method, urlPathname, status, formatDuration(beforeTime));
      console.log(logStr.join(' '));
    })
    .onError(({ error, request, store }) => {
      const logStr = [];
      const method = pc.red(formatRequestMethod(request.method, ' ✗ '));
      const urlPathname = new URL(request.url).pathname;
      const errorMessage = error.message;
      const beforeTime = (store as any).beforeTime;

      logStr.push(method, urlPathname, pc.red('Error'));

      if ('status' in error) {
        logStr.push(String(error.status));
      }

      logStr.push(errorMessage, formatDuration(beforeTime));
      console.log(logStr.join(' '));
    });
};
