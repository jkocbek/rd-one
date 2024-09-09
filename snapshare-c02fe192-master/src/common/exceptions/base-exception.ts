import { HttpException, HttpStatus, LogLevel } from '@nestjs/common';

export interface BaseExceptionAbstractOptions {
  message?: string;
  code?: string;
  detail?: string;
  severity?: LogLevel;
  meta?: Record<string, any>;
  cause?: Error;
}

/**
 * Base class for all internal exceptions
 */
export abstract class BaseExceptionAbstract extends HttpException {
  /**
   * Severity used in reporting
   */
  public readonly severity?: LogLevel;

  /**
   * The slug of the type of warn for the client.
   *  - can be as specific as needed
   */
  public readonly code?: string;

  /**
   * English human-readable explanation
   */
  public readonly detail?: string;

  /**
   * MetaObject gets sent to the client as-is.
   */
  public readonly meta?: Record<string, any>;

  protected constructor(httpStatus: HttpStatus, options?: BaseExceptionAbstractOptions) {
    const status = httpStatus && httpStatus in HttpResponseDetails ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR;
    const httpDetails = HttpResponseDetails[status];

    super(options?.message || httpDetails.message, status);

    this.severity = options?.severity || httpDetails.logLevel;
    this.code = options?.code || httpDetails.code;
    this.detail = options?.detail;
    this.meta = options?.meta;
    this.cause = options?.cause;
  }

  public toJSON() {
    return {
      message: this.message,
      severity: this.severity,
      code: this.code,
      detail: this.detail,
      meta: this.meta,
    };
  }

  public toString(): string {
    return `Exception ${this.code} ${this.message}: ${this.detail}`;
  }
}

export const HttpResponseDetails: Record<HttpStatus, { message: string; code: string; logLevel: LogLevel }> = {
  [HttpStatus.CONTINUE]: {
    message: 'Continue',
    code: 'continue',
    logLevel: 'verbose',
  },
  [HttpStatus.SWITCHING_PROTOCOLS]: {
    message: 'Switching Protocols',
    code: 'switchingProtocols',
    logLevel: 'verbose',
  },
  [HttpStatus.PROCESSING]: {
    message: 'Processing',
    code: 'processing',
    logLevel: 'verbose',
  },
  [HttpStatus.EARLYHINTS]: {
    message: 'Early Hints',
    code: 'earlyHints',
    logLevel: 'verbose',
  },
  [HttpStatus.OK]: {
    message: 'OK',
    code: 'ok',
    logLevel: 'verbose',
  },
  [HttpStatus.CREATED]: {
    message: 'Created',
    code: 'created',
    logLevel: 'verbose',
  },
  [HttpStatus.ACCEPTED]: {
    message: 'Accepted',
    code: 'accepted',
    logLevel: 'verbose',
  },
  [HttpStatus.NON_AUTHORITATIVE_INFORMATION]: {
    message: 'Non-Authoritative Information',
    code: 'nonAuthoritativeInformation',
    logLevel: 'verbose',
  },
  [HttpStatus.NO_CONTENT]: {
    message: 'No Content',
    code: 'noContent',
    logLevel: 'verbose',
  },
  [HttpStatus.RESET_CONTENT]: {
    message: 'Reset Content',
    code: 'resetContent',
    logLevel: 'verbose',
  },
  [HttpStatus.PARTIAL_CONTENT]: {
    message: 'Partial Content',
    code: 'partialContent',
    logLevel: 'verbose',
  },
  [HttpStatus.AMBIGUOUS]: {
    message: 'Ambiguous',
    code: 'ambiguous',
    logLevel: 'verbose',
  },
  [HttpStatus.MOVED_PERMANENTLY]: {
    message: 'Moved Permanently',
    code: 'movedPermanently',
    logLevel: 'log',
  },
  [HttpStatus.FOUND]: {
    message: 'Found',
    code: 'found',
    logLevel: 'verbose',
  },
  [HttpStatus.SEE_OTHER]: {
    message: 'See Other',
    code: 'seeOther',
    logLevel: 'verbose',
  },
  [HttpStatus.NOT_MODIFIED]: {
    message: 'Not Modified',
    code: 'notModified',
    logLevel: 'verbose',
  },
  [HttpStatus.TEMPORARY_REDIRECT]: {
    message: 'Temporary Redirect',
    code: 'temporaryRedirect',
    logLevel: 'verbose',
  },
  [HttpStatus.PERMANENT_REDIRECT]: {
    message: 'Permanent Redirect',
    code: 'permanentRedirect',
    logLevel: 'verbose',
  },
  [HttpStatus.BAD_REQUEST]: {
    message: 'Bad Request',
    code: 'badRequest',
    logLevel: 'warn',
  },
  [HttpStatus.UNAUTHORIZED]: {
    message: 'Unauthorized',
    code: 'unauthorized',
    logLevel: 'debug',
  },
  [HttpStatus.PAYMENT_REQUIRED]: {
    message: 'Payment Required',
    code: 'paymentRequired',
    logLevel: 'warn',
  },
  [HttpStatus.FORBIDDEN]: {
    message: 'Forbidden',
    code: 'forbidden',
    logLevel: 'log',
  },
  [HttpStatus.NOT_FOUND]: {
    message: 'Not Found',
    code: 'notFound',
    logLevel: 'debug',
  },
  [HttpStatus.METHOD_NOT_ALLOWED]: {
    message: 'Method Not Allowed',
    code: 'methodNotAllowed',
    logLevel: 'warn',
  },
  [HttpStatus.NOT_ACCEPTABLE]: {
    message: 'Not Acceptable',
    code: 'notAcceptable',
    logLevel: 'warn',
  },
  [HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: {
    message: 'Proxy Authentication Required',
    code: 'proxyAuthenticationRequired',
    logLevel: 'warn',
  },
  [HttpStatus.REQUEST_TIMEOUT]: {
    message: 'Request Timeout',
    code: 'requestTimeout',
    logLevel: 'warn',
  },
  [HttpStatus.CONFLICT]: {
    message: 'Conflict',
    code: 'conflict',
    logLevel: 'log',
  },
  [HttpStatus.GONE]: {
    message: 'Gone',
    code: 'gone',
    logLevel: 'log',
  },
  [HttpStatus.LENGTH_REQUIRED]: {
    message: 'Length Required',
    code: 'lengthRequired',
    logLevel: 'warn',
  },
  [HttpStatus.PRECONDITION_FAILED]: {
    message: 'Precondition Failed',
    code: 'preconditionFailed',
    logLevel: 'warn',
  },
  [HttpStatus.PAYLOAD_TOO_LARGE]: {
    message: 'Payload Too Large',
    code: 'payloadTooLarge',
    logLevel: 'warn',
  },
  [HttpStatus.URI_TOO_LONG]: {
    message: 'URI Too Long',
    code: 'uriTooLong',
    logLevel: 'warn',
  },
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: {
    message: 'Unsupported Media Type',
    code: 'unsupportedMediaType',
    logLevel: 'warn',
  },
  [HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: {
    message: 'Range Not Satisfiable',
    code: 'rangeNotSatisfiable',
    logLevel: 'warn',
  },
  [HttpStatus.EXPECTATION_FAILED]: {
    message: 'Expectation Failed',
    code: 'expectationFailed',
    logLevel: 'warn',
  },
  [HttpStatus.I_AM_A_TEAPOT]: {
    message: "I'm a teapot",
    code: 'imATeapot',
    logLevel: 'verbose',
  },
  [HttpStatus.MISDIRECTED]: {
    message: 'Misdirected',
    code: 'misdirected',
    logLevel: 'warn',
  },
  [HttpStatus.UNPROCESSABLE_ENTITY]: {
    message: 'Unprocessable Entity',
    code: 'unprocessableEntity',
    logLevel: 'warn',
  },
  [HttpStatus.FAILED_DEPENDENCY]: {
    message: 'Failed Dependency',
    code: 'failedDependency',
    logLevel: 'warn',
  },
  [HttpStatus.PRECONDITION_REQUIRED]: {
    message: 'Precondition Required',
    code: 'preconditionRequired',
    logLevel: 'warn',
  },
  [HttpStatus.TOO_MANY_REQUESTS]: {
    message: 'Too Many Requests',
    code: 'tooManyRequests',
    logLevel: 'warn',
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    message: 'Internal Server Error',
    code: 'internalServerError',
    logLevel: 'error',
  },
  [HttpStatus.NOT_IMPLEMENTED]: {
    message: 'Not Implemented',
    code: 'notImplemented',
    logLevel: 'error',
  },
  [HttpStatus.BAD_GATEWAY]: {
    message: 'Bad Gateway',
    code: 'badGateway',
    logLevel: 'error',
  },
  [HttpStatus.SERVICE_UNAVAILABLE]: {
    message: 'Service Unavailable',
    code: 'serviceUnavailable',
    logLevel: 'error',
  },
  [HttpStatus.GATEWAY_TIMEOUT]: {
    message: 'Gateway Timeout',
    code: 'gatewayTimeout',
    logLevel: 'error',
  },
  [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: {
    message: 'HTTP Version Not Supported',
    code: 'httpVersionNotSupported',
    logLevel: 'warn',
  },
};
