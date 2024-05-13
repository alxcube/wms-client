/**
 * WMS supported request type descriptor.
 */
export interface OperationType {
  /**
   * Supported response formats.
   */
  responseFormats: string[];

  /**
   * Base URL for making request.
   */
  httpGetUrl: string;
}
