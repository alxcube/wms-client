/**
 * `Dimension` objects enclose metadata for multidimensional data.
 *
 * `Dimension` element is used in service metadata to declare that one or more dimensional parameters are relevant to
 * a layer.
 */
export interface Dimension {
  /**
   * Name of dimensional axis
   */
  name: string;

  /**
   * Units of dimensional axis.
   */
  units: string;

  /**
   * Dimension units symbol.
   */
  unitSymbol?: string;

  /**
   * Property indicating default value that will be used if `GetMap` request does not specify a value. If property is
   * absent, then shall respond with a service exception if request does not include a value for that dimension.
   */
  default?: string;

  /**
   * Boolean property indicating whether multiple values of the dimension may be requested.
   * Default = false.
   */
  multipleValues?: boolean;

  /**
   * Boolean property indicating whether nearest value of the dimension will be returned in response to a request for a
   * nearby value:
   *  - false - request value(s) must correspond exactly to declared extent value(s);
   *  - true - request values may be approximate.
   * Default = false.
   */
  nearestValue?: boolean;

  /**
   * Boolean property valid only for temporal extents (i.e., if name="time"). This property, if it is `true`, indicates
   * (a) that temporal data are normally kept current and (b) that the request parameter `time` may include the keyword
   * 'current' instead of an ending value.
   * Default = false.
   */
  current?: boolean;

  /**
   * String indicating available value(s) for dimension.
   */
  value?: string; // TODO: rename to `extent`
}
