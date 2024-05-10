/**
 * Request error handler interface. Handles errors in http-requests to WMS.
 */
export interface RequestErrorHandler {
  /**
   * Handles request error.
   *
   * @param thrown
   */
  handleRequestError(thrown: Error | unknown): never;
}
