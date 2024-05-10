import type { QueryParamsSerializer } from "./QueryParamsSerializer";

/**
 * Base QueryParamsSerializer class.
 */
export class BaseQueryParamsSerializer implements QueryParamsSerializer {
  /**
   * @inheritdoc
   */
  serialize(queryParams: object, prefix = ""): string {
    return Object.keys(queryParams)
      .filter((key) => typeof key !== "symbol")
      .map((key) => {
        const paramName = prefix.length ? `${prefix}[${key}]` : key;
        const paramValue = queryParams[
          key as keyof typeof queryParams
        ] as unknown;

        if (typeof paramValue === "object" && paramValue !== null) {
          return this.serialize(paramValue, paramName);
        }
        return (
          this.encode(paramName) +
          "=" +
          this.encode(this.stringifyValue(paramValue))
        );
      })
      .join("&");
  }

  /**
   * Converts value to string.
   *
   * @param val
   * @private
   */
  private stringifyValue(val: unknown): string {
    switch (typeof val) {
      case "number":
        return String(val);
      case "string":
        return val;
      case "object":
      case "undefined":
        return "";
      default:
        return val ? "1" : "0";
    }
  }

  /**
   * Encodes string value for query string.
   *
   * @param str
   * @private
   */
  private encode(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }
}
