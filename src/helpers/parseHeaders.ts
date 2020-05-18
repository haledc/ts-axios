import { forEach, trim } from "../utils";

const ignoreDuplicateOf = [
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent",
];

export function parseHeaders(headers: string): any {
  const parsed = Object.create(null);
  let key;
  let val;
  let i;

  if (!headers) return parsed;

  forEach(headers.split("\n"), function parser(line: string) {
    i = line.indexOf(":");
    key = trim(line.substr(0, i)).toLowerCase();
    val = trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === "set-cookie") {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    }
  });

  return parsed;
}
