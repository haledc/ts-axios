import { isStandardBrowserEnv, isNumber, isString } from "../utils";

const cookie = isStandardBrowserEnv()
  ? (function standardBrowserEnv() {
      return {
        write: function write(
          name: string,
          value: string | number | boolean,
          expires?: number | string | Date,
          path?: string,
          domain?: string,
          secure?: true
        ) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));

          if (isNumber(expires)) {
            cookie.push("expires=" + new Date(expires!).toUTCString());
          }

          if (isString(path)) {
            cookie.push("path=" + path);
          }

          if (isString(domain)) {
            cookie.push("domain=" + domain);
          }

          if (secure === true) {
            cookie.push("secure");
          }

          document.cookie = cookie.join("; ");
        },

        read: function read(name: string) {
          var match = document.cookie.match(
            new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
          );
          return match ? decodeURIComponent(match[3]) : null;
        },

        remove: function remove(name: string) {
          this.write(name, "", Date.now() - 86400000);
        },
      };
    })()
  : (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() {
          return null;
        },
        remove: function remove() {},
      };
    })();

export default cookie;
