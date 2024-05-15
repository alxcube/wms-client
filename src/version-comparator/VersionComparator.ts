/**
 * Version comparison operator.
 */
export type ComparisonOperator = "<" | ">" | "=" | "!=" | "<=" | ">=";

/**
 * Version comparator interface.
 */
export interface VersionComparator {
  /**
   * Compares two versions. Returns -1 when v1 is less than v2, 1 when v1 > v2, 0 when v1 = v2.
   *
   * @param v1
   * @param v2
   */
  compare(v1: string, v2: string): -1 | 0 | 1;

  /**
   * Returns boolean result of comparison or given versions, using given operator.
   *
   * @param v1
   * @param operator
   * @param v2
   */
  is(v1: string, operator: ComparisonOperator, v2: string): boolean;
}
