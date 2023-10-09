import Elysia from 'elysia';
import process from 'process';
import pc from 'picocolors';

export const lcLogger = () => {
  return new Elysia({
    name: '@lc/Elysialogger',
  })
    .onBeforeHandle((ctx) => {
      ctx.store = { beforeTime: process.hrtime(), ...ctx.store };
    })
    .onAfterHandle(({ request, store }) => {
      const logStr = [];
      const forwardedFor = request.headers.get('X-Forwarded-For');
      const method = methodString({ method: request.method, check: ' ✔ ' });
      const urlPathname = new URL(request.url).pathname;
      const beforeTime = (store as any).beforeTime;

      if (forwardedFor) {
        logStr.push(`[${pc.cyan(forwardedFor)}]`);
      }

      logStr.push(method, urlPathname, durationString(beforeTime));
      console.log(logStr.join(' '));
    })
    .onError(({ request, error, store }) => {
      const logStr = [];
      const method = pc.red(
        methodString({ method: request.method, check: ' ✗ ' })
      );
      const urlPathname = new URL(request.url).pathname;
      const errorMessage = error.message;
      const beforeTime = (store as any).beforeTime;

      logStr.push(method, urlPathname, pc.red('Error'));

      if ('status' in error) {
        logStr.push(String(error.status));
      }

      logStr.push(errorMessage, durationString(beforeTime));
      console.log(logStr.join(' '));
    });
};

function durationString(beforeTime: [number, number]): string {
  const [seconds, nanoseconds] = process.hrtime(beforeTime);
  const durationInMicroseconds = (seconds * 1e9 + nanoseconds) / 1e3; // Convert to microseconds
  const durationInMilliseconds = (seconds * 1e9 + nanoseconds) / 1e6; // Convert to milliseconds
  let timeMessage: string = '';
  if (seconds > 0) {
    timeMessage = `${pc.white('❘')} ${seconds.toPrecision(2)}s`;
  } else if (durationInMilliseconds > 1) {
    timeMessage = `${pc.white('❘')} ${durationInMilliseconds.toPrecision(2)}ms`;
  } else if (durationInMicroseconds > 1) {
    timeMessage = `${pc.white('❘')} ${durationInMicroseconds.toPrecision(4)}µs`;
  } else if (nanoseconds > 0) {
    timeMessage = `${pc.white('❘')} ${nanoseconds.toPrecision(4)}ns`;
  }

  return timeMessage;
}

function methodString({
  method,
  check,
}: {
  method: string;
  check: string;
}): string {
  switch (method) {
    case 'GET':
      // Handle GET request
      return pc.white(pc.bold(check + 'GET'));

    case 'POST':
      // Handle POST request
      return pc.yellow(pc.bold(check + 'POST'));

    case 'PUT':
      // Handle PUT request
      return pc.blue(pc.bold(check + 'PUT'));

    case 'DELETE':
      // Handle DELETE request
      return pc.red(pc.bold(check + 'DELETE'));

    case 'PATCH':
      // Handle PATCH request
      return pc.green(pc.bold(check + 'PATCH'));

    case 'OPTIONS':
      // Handle OPTIONS request
      return pc.gray(pc.bold(check + 'OPTIONS'));

    case 'HEAD':
      // Handle HEAD request
      return pc.magenta(pc.bold(check + 'HEAD'));

    default:
      // Handle unknown request method
      return method;
  }
}
