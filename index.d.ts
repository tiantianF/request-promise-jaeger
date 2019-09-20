import request from 'request';
import { Tracer,Span } from 'opentracing';

declare module 'request' {
  interface CoreOptions {
    tracer?: Tracer,
    rootSpan?: Span
  }
}

import rp from 'request-promise';

export =  rp;

