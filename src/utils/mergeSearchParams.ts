/**
 * Options of `mergeSearchParams()` function.
 */
export interface MergeSearchParamsOptions {
  /**
   * When set to `true` and given url has query string with params of same names as in given query string,
   * corresponding params of url will be replaced by values from given query string.
   */
  replace?: boolean;
}

/**
 * Merges given url query string params with other query string params.
 *
 * @param url
 * @param queryString
 * @param options
 */
export function mergeSearchParams(
  url: string,
  queryString: string,
  options: MergeSearchParamsOptions = {}
): string {
  const urlObj = new URL(url);
  const searchParams = new URLSearchParams(queryString);
  if (!options.replace) {
    for (const [key, val] of urlObj.searchParams) {
      searchParams.set(key, val);
    }
  }
  for (const [key, val] of searchParams) {
    urlObj.searchParams.set(key, val);
  }

  return urlObj.toString();
}
