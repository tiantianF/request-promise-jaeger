# Request-Promise-Jaeger

The simplified HTTP request client 'request' with Jaeger support. Powered by `request-promise`.

# Installation

```js
npm install --save request-promise-jaeger
```

# Usage

[See Request-Promise](https://www.npmjs.com/package/request-promise)

```js
const rp = require('request-promise-jaeger');

rp('http://www.google.com', {
  tracer: Tracer, // your-tracer
  rootSpan: Span // your-root-span
  // ... other options
});
```
