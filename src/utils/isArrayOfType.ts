import type { TypeChecker, TypeofReturnValue } from "./hasPropOfType";

export function isArrayOfType(
  arr: unknown | unknown[],
  types: TypeofReturnValue | TypeofReturnValue[] | TypeChecker
): boolean {
  if (!Array.isArray(arr)) {
    return false;
  }
  if (!arr.length) {
    return true;
  }

  let typeChecker: (item: unknown) => boolean;
  if (typeof types === "function") {
    typeChecker = types;
  } else {
    const typesArr = Array.isArray(types) ? types : [types];
    typeChecker = (item: unknown) => typesArr.includes(typeof item);
  }

  return arr.every(typeChecker);
}
