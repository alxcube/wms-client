import { type AxiosResponse, isAxiosError } from "axios";
import type { WmsXmlParser } from "../wms-xml-parser";
import type { RequestErrorHandler } from "./RequestErrorHandler";

/**
 * Base request error handler class.
 */
export class BaseRequestErrorHandler implements RequestErrorHandler {
  /**
   * BaseRequestErrorHandler constructor.
   *
   * @param textDecoder
   * @param wmsXmlParser
   */
  constructor(
    private readonly textDecoder: TextDecoder,
    private readonly wmsXmlParser: WmsXmlParser
  ) {}

  /**
   * @inheritdoc
   */
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

  /**
   * Detects if response is xml, based on Content-Type header.
   *
   * @param response
   * @private
   */
  private isXmlResponse(response: AxiosResponse): boolean {
    return /(?:\b|_)xml(?:\b|_)/.test(response.headers["content-type"]);
  }

  /**
   * Returns http response body as string if response body is either string or ArrayBuffer.
   *
   * @param response
   * @private
   */
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
