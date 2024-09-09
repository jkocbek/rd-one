/**
 * A log of an express response
 */
export interface RequestLogInterface {
  /**
   * User id
   */
  userId?: string;

  /**
   * IPv4 address of the remote request
   */
  remoteIp: string | undefined;

  /**
   * The endpoint used
   * - grouping by resource for analytics
   */
  requestRoute?: string;

  /**
   * The requested resource
   * - useful for auditing read access
   */
  requestUrl?: string;

  /**
   * HTTP response code
   */
  responseCode?: number | undefined;

  /**
   * Time it took to handle this request in milliseconds
   */
  responseTime?: number;
}
