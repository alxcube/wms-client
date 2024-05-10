/**
 * Returns XML node name with namespace, if namespace is given and is not empty. Returns XML node name without
 * namespace otherwise.
 *
 * @param nodeName
 * @param namespace
 */
export function withNamespace(nodeName: string, namespace?: string): string {
  return namespace && namespace.length ? `${namespace}:${nodeName}` : nodeName;
}
