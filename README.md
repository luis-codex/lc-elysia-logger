# lc-elysia-logger

## Installation

```bash
bun add lc-elysia-logger
```

## Usage

```js
import { lcLogger } from 'lc-elysia-logger';
import { Elysia } from 'elysia';

const app = new Elysia()
  .use(lcLogger())
  .group('lc-elysia-logger', (api) =>
    api
      .get('/', () => ({ message: 'API' }))
      .post('/', () => ({ message: 'API' }))
      .put('/', () => ({ message: 'API' }))
      .delete('/', () => ({ message: 'API' }))
      .patch('/', () => ({ message: 'API' }))
      .options('/', () => ({ message: 'API' }))
      .head('/', () => ({ message: 'API' }))
  )  
  .listen(3000);

console.log(` - API is running at ${app.server?.hostname}:${app.server?.port}`);

```

## Result

![Result logger](https://github.com/luis-tenorio-code/lc-elysia-logger/blob/master/example.png?raw=true)
