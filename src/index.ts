import { Elysia } from 'elysia';
import process from 'process';
import pc from 'picocolors';

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
    .onAfterHandle(({ request, store }) => {
      const logStr = [];
      const forwardedFor = request.headers.get('X-Forwarded-For');
      const method = formatRequestMethod(request.method, ' ✔ ');
      const urlPathname = new URL(request.url).pathname;
      const beforeTime = (store as any).beforeTime;

      if (forwardedFor) {
        logStr.push(`[${pc.cyan(forwardedFor)}]`);
      }

      logStr.push(method, urlPathname, formatDuration(beforeTime));
      console.log(logStr.join(' '));
    })
    .onError(({ request, error, store }) => {
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

/**
 * Formatea la duración de una solicitud en una cadena legible.
 * @param {number[]} beforeTime - Tiempo antes de manejar la solicitud.
 * @returns {string} Cadena de texto formateada que representa la duración.
 */
function formatDuration(beforeTime: [number, number]): string {
  const [seconds, nanoseconds] = process.hrtime(beforeTime);
  const durationInMicroseconds = (seconds * 1e9 + nanoseconds) / 1e3;
  const durationInMilliseconds = (seconds * 1e9 + nanoseconds) / 1e6;

  if (seconds > 0) {
    return `${pc.white('❘')} ${seconds.toPrecision(2)}s`;
  } else if (durationInMilliseconds > 1) {
    return `${pc.white('❘')} ${durationInMilliseconds.toPrecision(2)}ms`;
  } else if (durationInMicroseconds > 1) {
    return `${pc.white('❘')} ${durationInMicroseconds.toPrecision(4)}µs`;
  } else if (nanoseconds > 0) {
    return `${pc.white('❘')} ${nanoseconds.toPrecision(4)}ns`;
  }

  return '';
}

/**
 * Formatea el método de solicitud HTTP para mostrarlo con colores.
 * @param {string} method - Método de solicitud HTTP.
 * @param {string} check - Marca para indicar éxito o error.
 * @returns {string} Cadena de texto formateada con colores.
 */
function formatRequestMethod(method: string, check: string): string {
  switch (method) {
    case 'GET':
      return pc.green(pc.bold(check + 'GET'));

    case 'POST':
      return pc.blue(pc.bold(check + 'POST'));

    case 'PUT':
      return pc.yellow(pc.bold(check + 'PUT'));

    case 'DELETE':
      return pc.red(pc.bold(check + 'DELETE'));

    case 'PATCH':
      return pc.magenta(pc.bold(check + 'PATCH'));

    case 'OPTIONS':
      return pc.cyan(pc.bold(check + 'OPTIONS'));

    case 'HEAD':
      return pc.gray(pc.bold(check + 'HEAD'));

    default:
      return method;
  }
}
