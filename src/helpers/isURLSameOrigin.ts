import { isStandardBrowserEnv, isString } from "../utils";

interface URLOrigin {
  protocol: string;
  host: string;
}

interface ParsedURL {
  href: string;
  protocol: string;
  host: string;
  search: string;
  hash: string;
  hostname: string;
  port: string;
  pathname: string;
}

export const isURLSameOrigin = isStandardBrowserEnv()
  ? (function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent);
      const urlParsingNode = document.createElement("a");
      let originURL: URLOrigin;

      function resolveURL(url: string): ParsedURL {
        var href = url;

        if (msie) {
          // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute("href", href);

        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname:
            urlParsingNode.pathname.charAt(0) === "/"
              ? urlParsingNode.pathname
              : "/" + urlParsingNode.pathname,
        };
      }

      originURL = resolveURL(window.location.href);

      return function isURLSameOrigin(requestURL: string | ParsedURL) {
        let parsed: ParsedURL;
        if (isString(requestURL)) {
          parsed = resolveURL(requestURL as string);
        } else {
          parsed = requestURL as ParsedURL;
        }

        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    })()
  : (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })();
