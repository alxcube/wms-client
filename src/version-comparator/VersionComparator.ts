export type ComparsionOperator = "<" | ">" | "=" | "!=" | "<=" | ">=";
export interface VersionComparator {
  compare(v1: string, v2: string): -1 | 0 | 1;
  is(v1: string, operator: ComparsionOperator, v2: string): boolean;
}
