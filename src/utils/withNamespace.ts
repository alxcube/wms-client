export function withNamespace(nodeName: string, namespace: string): string {
  return namespace.length ? `${namespace}:${nodeName}` : nodeName;
}
