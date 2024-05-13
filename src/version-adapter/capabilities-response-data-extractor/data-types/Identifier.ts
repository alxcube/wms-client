/**
 * A Map Server may use zero or more `Identifier` objects to list ID numbers or labels defined by a particular
 * Authority.
 *
 * NOTE The semantics of how an authority defines the meaning of an identifier have not yet been precisely defined.
 * The `Identifier` is provided as a convenience for servers that wish to indicate the correspondence between the WMS
 * Layers they offer and a classification of those Layers defined by the organization that operates the service.
 */
export interface Identifier {
  /**
   * The ID value.
   */
  value: string;

  /**
   * URL of a document defining the meaning of the Identifier values.
   */
  authorityUrl: string;
}
