import type {
  ComparsionOperator,
  VersionComparator,
} from "./VersionComparator";

export class BaseVersionComparator implements VersionComparator {
  compare(v1: string, v2: string): -1 | 0 | 1 {
    const [major1, minor1 = "0", patch1 = "0"] = v1.split(".");
    const [major2, minor2 = "0", patch2 = "0"] = v2.split(".");
    const majorResult = this.compareComponent(major1, major2);
    if (majorResult !== 0) {
      return majorResult;
    }
    const minorResult = this.compareComponent(minor1, minor2);
    if (minorResult !== 0) {
      return minorResult;
    }
    return this.compareComponent(patch1, patch2);
  }

  is(v1: string, operator: ComparsionOperator, v2: string): boolean {
    const result = this.compare(v1, v2);
    switch (operator) {
      case "=":
        return result === 0;
      case "!=":
        return result !== 0;
      case ">":
        return result > 0;
      case "<":
        return result < 0;
      case ">=":
        return result >= 0;
      case "<=":
        return result <= 0;
    }
  }

  private compareComponent(component1: string, component2: string): -1 | 0 | 1 {
    if (component1 === "*" || component2 === "*") {
      return 0;
    }
    const numComponent1 = parseInt(component1, 10);
    const numComponent2 = parseInt(component2, 10);
    return numComponent1 > numComponent2
      ? 1
      : numComponent1 < numComponent2
        ? -1
        : 0;
  }
}
