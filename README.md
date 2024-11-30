# Overview

GramAlly app offers an interactive interface to interact with images hosted on https://jsonplaceholder.typicode.com/

It is hosted on Vercel at https://gramally-prod.vercel.app/

## Technology Stack

- [Remix version 2](https://remix.run/docs) with Vite
- React JS (latest)
- TypeScript
- Tailwind CSS
- Github Oauth
- Vitest with React Testing Library
- V8 for test coverage
- Sentry for monitoring
- Prettier for formatting
- ESLint

## Setup

1. Navigate into the project folder using the terminal
2. Install dependencies

```bash
npm i
```

3. Start development server

```bash
npm run dev
```

4. Visit http://localhost:5173 in your browser

## Other useful commands

### `npm run build`

Build app in preparation for deployment

### `npm start`

Start production server

### `npm run lint`

Checks for linting errors

This command is run automatically each time a new commit is initiated

### `npm run test`

Runs tests

This command is run automatically each time you push new commits

### `npm run coverage`

Generate coverage report

## Disclaimers

- Since the JSON placeholder server doesn't actually update data after `PUT` requests, the title in the Photo Page will revert to the initial one if page is reloaded.

- Also the JSON placeholder server may timeout occasionally
