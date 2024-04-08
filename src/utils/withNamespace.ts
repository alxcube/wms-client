export function withNamespace(nodeName: string, namespace?: string): string {
  return namespace && namespace.length ? `${namespace}:${nodeName}` : nodeName;
}
