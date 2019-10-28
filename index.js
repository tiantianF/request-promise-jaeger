'use strict';

const rp = require('request-promise');
const url = require('url');

const { FORMAT_HTTP_HEADERS, Tags } = require('opentracing');

module.exports = async function(...args) {
  let options;
  if (typeof args[0] === 'string') {
    options = args[1] || {};
    options.uri = args[0];
  } else {
    options = args[0];
  }
  if (!options.rootSpan || !options.tracer) {
    return rp.apply(this, args);
  }
  const method = options.method || 'GET';
  options.headers = options.headers || {};
  const spanOptions = {
    tags: {
      [Tags.HTTP_METHOD]: method,
      [Tags.HTTP_URL]: options.uri,
      'http.req_body': options.data || {}
    },
    childOf: options.rootSpan
  };
  const reqUrl = new url.URL(options.uri);
  const path = `${reqUrl.pathname}${reqUrl.search}`;
  const span = options.tracer.startSpan(`${path}`, spanOptions);
  options.tracer.inject(span, FORMAT_HTTP_HEADERS, options.headers);
  try {
    const res = await rp.apply(this, args);
    span.finish();
    return res;
  } catch (err) {
    span.setTag(Tags.ERROR, true);
    span.log({
      event: 'ERROR_HTTP_REQUEST',
      message: err.message,
      stack: err.stack
    });
    span.finish();
    throw err;
  }
};
