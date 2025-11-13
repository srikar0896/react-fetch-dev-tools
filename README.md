# react-fetch-dev-tools

React integration for fetch-dev-tools — a lightweight, single-line plugin that brings deterministic and randomized network mocking to React apps. Use it to simulate timeouts, throttling, intermittent failures, partial responses, rate limits, and other network conditions that are hard to reproduce, all with minimal code changes.

This package is an extension of fetch-dev-tools and provides React-first APIs: a Provider, React hooks, HOCs, and devtools-friendly utilities to scope mocks per component/tree and to integrate easily with testing and SSR setups.

## Features

- Single-line or provider-based integration for React apps
- useMock / useFetchDev hook for component-scoped mock rules
- Provider to apply global or route-scoped rules
- HOC and render-prop adapters for legacy code
- Declarative rules by URL, method, headers, query params, body, or regex
- Simulate delays, throttling, HTTP errors, partial responses, rate limits, and connection faults
- Response sequencing and percentage-based injection for flaky behaviors
- Fixtures, record & replay, and proxy-to-real-endpoint modes
- TypeScript support and type definitions
- Works in CRA, Vite, Next.js (CSR & SSR-aware), and test runners (Jest, RTL)
- Small runtime footprint; compatible with fetch, axios adapters, or Service Worker mode
- Devtools / inspector for viewing active rules and recent matches

## Quick start

Install:

```bash
npm install react-fetch-dev-tools fetch-dev-tools --save-dev
# or
yarn add -D react-fetch-dev-tools fetch-dev-tools
```

Single-line global (simple):

```js
// src/setupMocks.js
import 'react-fetch-dev-tools/register'; // installs the interceptor and a default provider
```

Provider-based (recommended):

```jsx
// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FetchDevProvider } from 'react-fetch-dev-tools';
import App from './App';
import mocksConfig from './mocks/fetch-mocks.json';

createRoot(document.getElementById('root')).render(
  <FetchDevProvider config={mocksConfig}>
    <App />
  </FetchDevProvider>
);
```

Component-scoped mock with hook:

```jsx
import React from 'react';
import { useMock } from 'react-fetch-dev-tools';

function UsersList() {
  useMock({
    match: { url: '/api/users', method: 'GET' },
    actions: [
      { type: 'delay', ms: 1000 },
      { type: 'respond', status: 200, body: [{ id: 1, name: 'Alice' }] }
    ]
  });

  // normal fetch code in component will be intercepted
  // ...
}
```

Programmatic API:

```js
import { mock } from 'react-fetch-dev-tools';

// add or update rules at runtime
mock.addRule({
  match: { url: '/api/slow' },
  actions: [{ type: 'delay', ms: 2000 }, { type: 'respond', status: 200, body: { ok: true } }]
});

// restore native behavior
mock.restore();
```

## Example rule (JSON)

```json
{
  "rules": [
    {
      "match": { "url": "https://api.example.com/.*", "method": "GET" },
      "actions": [
        { "type": "delay", "ms": 800 },
        { "type": "respond", "status": 200, "bodyFile": "fixtures/example.json" }
      ],
      "percentage": 50
    }
  ]
}
```

## Testing

Jest + React Testing Library

- Use register or provider in your test setup file
- Reset rules between tests

jest.setup.js:

```js
import 'react-fetch-dev-tools/register';
import { mock } from 'react-fetch-dev-tools';

beforeEach(() => mock.reset());
afterAll(() => mock.restore());
```

Example test:

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { mock } from 'react-fetch-dev-tools';

test('shows mocked users', async () => {
  mock.addRule({
    match: { url: '/api/users' },
    actions: [{ type: 'respond', status: 200, body: [{ id: 1, name: 'Test' }] }]
  });

  render(<App />);
  await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument());
});
```

E2E (Cypress / Playwright)

- Start the CLI mock server (npx fetch-dev-tools serve --config config/mocks.json)
- Or use Service Worker injection in the test browser context
- Use deterministic rules for reproducible tests; use seeded random for flaky tests

## SSR / Next.js notes

- For SSR, prefer server-side/Express middleware adapter or proxy mode in fetch-dev-tools to ensure consistent responses during hydration.
- On Next.js, wrap <App /> with FetchDevProvider in _app.js only in development/test environments.
- Avoid client-only Service Worker mode for pages that require identical SSR/CSR responses.

## API Reference (high level)

- FetchDevProvider({ config, mode, children }): React context provider for global rules
- useMock(rule | rule[]): Hook to apply rules scoped to the component lifecycle
- useFetchDev(): Access mock control object (addRule, removeRule, listRules, reset, record, replay)
- withFetchDev(Component, options): HOC to supply mock control & auto-cleanup
- mock: global programmatic API (mock.addRule, mock.removeRule, mock.reset, mock.restore, mock.start, mock.stop)

Check the package types for full TypeScript definitions.

## Configuration

- Accepts JSON or JS config files (path via FDT_CONFIG or provider prop)
- Accepts env overrides (FDT_MODE, FDT_SEED, FDT_RECORD_DIR)
- Supports per-rule percentage injection and seeded random mode for reproducible flaky behaviors

## Devtools & Inspector

- Optional UI that mounts in your app during development for:
  - Listing active rules
  - Seeing match counts and recent matching requests
  - Enabling/disabling rules on the fly
- Enable via provider prop: <FetchDevProvider devtools={true} />

## Advanced use cases

- Simulate bandwidth throttling to test upload/download progress UI
- Sequence responses to test retry/exponential backoff logic
- Partial responses / streaming simulations for media and chunked APIs
- Integrate with Storybook to simulate network conditions per story

## Migration from fetch-dev-tools

- Most rules and CLI config are compatible; this package adds a React Provider and lifecycle-scoped APIs.
- If you were using global register, you can keep using it; prefer Provider for scoped control.

## Contributing

- Fork, create a branch, add tests under tests/, and open a pull request.
- Run unit tests: npm test
- Use the example app in /examples to verify integrations (CRA, Vite, Next.js)
- Please include reproducible steps and fixtures when reporting bugs.

## License

MIT — see LICENSE for details

## Contact

Open an issue in this repository for questions, feature requests, or to report bugs.
