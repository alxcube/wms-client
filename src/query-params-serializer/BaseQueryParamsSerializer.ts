import type { QueryParamsSerializer } from "./QueryParamsSerializer";

export class BaseQueryParamsSerializer implements QueryParamsSerializer {
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

  private encode(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }
}
