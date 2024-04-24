import { type AxiosResponse, isAxiosError } from "axios";
import type { WmsXmlParser } from "../wms-xml-parser";
import type { RequestErrorHandler } from "./RequestErrorHandler";

export class BaseRequestErrorHandler implements RequestErrorHandler {
  constructor(
    private readonly textDecoder: TextDecoder,
    private readonly wmsXmlParser: WmsXmlParser
  ) {}
  handleRequestError(thrown: Error | unknown): never {
    if (
      isAxiosError(thrown) &&
      thrown.response &&
      this.isXmlResponse(thrown.response)
    ) {
      // If response xml contains exception report, xml parser will throw.
      this.wmsXmlParser.parse(this.getResponseBodyString(thrown.response));
    }
    throw thrown;
  }

  private isXmlResponse(response: AxiosResponse): boolean {
    return /(?:\b|_)xml(?:\b|_)/.test(response.headers["content-type"]);
  }

  private getResponseBodyString(response: AxiosResponse): string {
    if (typeof response.data === "string") {
      return response.data;
    }
    if (response.data instanceof ArrayBuffer) {
      return this.textDecoder.decode(response.data);
    }
    throw new TypeError(`Unexpected response type`);
  }
}
