export interface RequestErrorHandler {
  handleRequestError(thrown: Error | unknown): never;
}
