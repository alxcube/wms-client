export interface MergeSearchParamsOptions {
  replace?: boolean;
}
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
