export type TypeofReturnValue =
  | "string"
  | "number"
  | "boolean"
  | "undefined"
  | "object"
  | "function"
  | "symbol"
  | "bigint";

export type TypeChecker = (val: unknown) => boolean;

export function hasPropOfType<T extends object>(
  obj: Partial<T>,
  prop: keyof T,
  types: TypeofReturnValue | TypeofReturnValue[] | TypeChecker
): boolean {
  if (typeof types === "function") {
    return types(obj[prop]);
  }

  if (!Array.isArray(types)) {
    types = [types];
  }
  return types.includes(typeof obj[prop]);
}
