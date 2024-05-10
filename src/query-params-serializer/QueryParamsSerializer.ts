/**
 * Query Params Serializer.
 */
export interface QueryParamsSerializer {
  /**
   * Serializes query params object to query string.
   *
   * @param queryParams
   */
  serialize(queryParams: object): string;
}
