import {
  hasPropOfType,
  type TypeChecker,
  type TypeofReturnValue,
} from "./hasPropOfType";
import { isObject } from "./isObject";

export type InterfaceSchema<T> = {
  [key in keyof T]: TypeofReturnValue | TypeofReturnValue[] | TypeChecker;
};

export function isMatchingInterface<T extends object>(
  schema: InterfaceSchema<T>,
  object: unknown | Partial<T>
): object is T {
  if (!isObject(object)) {
    return false;
  }
  const keys = Object.keys(schema) as (keyof Partial<T>)[];
  return keys.every((prop) => hasPropOfType(object, prop, schema[prop]));
}
