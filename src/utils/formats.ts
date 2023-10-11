import pc from 'picocolors';

export function formatDuration(beforeTime: [number, number]): string {
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

export function formatRequestMethod(method: string, check: string): string {
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
      return pc.bold(check + method);
  }
}

export function formatStatus(
  status: number | string | undefined
): string | undefined {
  switch (status) {
    case 200:
      return pc.green(pc.bold(status));

    case 201:
      return pc.blue(pc.bold(status));

    case 204:
      return pc.yellow(pc.bold(status));

    case 400:
      return pc.red(pc.bold(status));

    case 401:
      return pc.magenta(pc.bold(status));

    case 403:
      return pc.cyan(pc.bold(status));

    case 404:
      return pc.gray(pc.bold(status));

    case 500:
      return pc.gray(pc.bold(status));

    default:
      return pc.bold(status);
  }
}
