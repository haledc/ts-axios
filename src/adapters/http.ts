import http, { Agent } from "http";
import https from "https";
import { parse } from "url";
import zlib from "zlib";
import { http as httpFollow, https as httpsFollow } from "follow-redirects";
import pkg from "../../package.json";
import { AxiosRequestConfig, AxiosPromise } from "../types";
import { isStream, isArrayBuffer, isString, isBuffer } from "../utils";
import { createError } from "../core/createError";
import { buildURL } from "../helpers/buildURL";
import { settle } from "../core/settle";

const isHttps = /https:?/;

export default function httpAdapter(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolvePromise, rejectPromise) => {
    const resolve = (value: any) => resolvePromise(value);
    const reject = (reason: any) => rejectPromise(reason);

    let {
      data,
      method,
      headers,
      auth,
      url,
      httpsAgent,
      httpAgent,
      socketPath,
      proxy,
      transport,
      maxRedirects,
      maxBodyLength,
      maxContentLength,
      decompress,
      responseType,
      responseEncoding,
      timeout,
      cancelToken,
    } = config;

    if (!headers["User-Agent"] && !headers["user-agent"]) {
      headers["User-Agent"] = "axios/" + pkg.version;
    }

    if (data && isStream(data)) {
      if (isBuffer(data)) {
        // Nothing to do ...
      } else if (isArrayBuffer(data)) {
        data = Buffer.from(data);
      } else if (isString(data)) {
        data = Buffer.from(data, "utf-8");
      } else {
        return reject(
          createError(
            "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
            config
          )
        );
      }

      headers["Content-Length"] = data.length;
    }

    let authstr;
    if (auth) {
      authstr = `${auth.username}:${auth.password}`;
    }

    const parsed = parse(url!);
    const protocol = parsed.protocol || "http";

    if (!auth && parsed.auth) {
      const urlAuth = parsed.auth.split(":");
      authstr = `${urlAuth[0]}:${urlAuth[1]}`;
    }

    if (authstr) {
      delete headers.Authorization;
    }

    const isHttpsRequest = isHttps.test(protocol);
    const agent = isHttpsRequest ? httpsAgent : httpAgent;

    const options: { [key: string]: any } = {
      path: buildURL(parsed.path!, config.params, config.paramsSerializer).replace(/^\?/, ""),
      method,
      headers,
      agent,
      agents: { http: httpAgent, https: httpsAgent },
      auth: authstr,
    };

    if (socketPath) {
      options.socketPath = socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    if (!proxy && proxy !== false) {
      const proxyEnv = protocol.slice(0, -1) + "_proxy";
      const proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];

      if (proxyUrl) {
        const parsedProxyUrl = parse(proxyUrl);
        const noProxyEnv = process.env.no_pxory || process.env.NO_PROXY;
        let shouldProxy = true;

        if (noProxyEnv) {
          const noProxy = noProxyEnv.split(",").map((s) => s.trim());

          shouldProxy = !noProxy.some((proxyElement) => {
            if (!proxyElement) return false;
            if (proxyElement === "*") return true;
            if (
              proxyElement[0] === "." &&
              parsed.hostname?.substr(parsed.hostname.length - proxyElement.length) === proxyElement
            ) {
              return true;
            }
            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname!,
            port: Number(parsedProxyUrl.port!),
          };
        }

        if (parsedProxyUrl.auth) {
          const proxyUrlAuth = parsedProxyUrl.auth.split(":");
          proxy!.auth = {
            username: proxyUrlAuth[0],
            password: proxyUrlAuth[1],
          };
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? `:${parsed.port}` : "");
      options.port = proxy.port;
      options.path =
        protocol + "//" + parsed.hostname + (parsed.port ? `:${parsed.port}` : "") + options.path;

      if (proxy.auth) {
        const base64 = Buffer.from(
          proxy.auth.username + ":" + proxy.auth.password,
          "utf-8"
        ).toString("base64");
        options.headers["Proxy-Authorization"] = "Basic " + base64;
      }
    }

    let trans;
    const isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol!) : true);

    if (transport) {
      trans = transport;
    } else if (maxRedirects === 0) {
      trans = isHttpsProxy ? https : http;
    } else {
      if (maxRedirects) {
        options.maxRedirects = maxRedirects;
      }
      trans = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (maxBodyLength! > -1) {
      options.maxBodyLength = maxBodyLength;
    }

    // request
    const req = trans.request(options, (res: any) => {
      if (req.aborted) return;

      let stream = res;
      const lastRequest = res.req || req;

      if (res.statusCode !== 204 && lastRequest.method !== "HEAD" && decompress) {
        switch (res.headers["content-encoding"]) {
          case "gzip":
          case "decompress":
          case "deflate":
            stream = stream.pipe(zlib.createUnzip());
            delete res.headers["content-encoding"];
            break;
        }
      }

      const response: { [key: string]: any } = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config,
        request: lastRequest,
      };

      if (responseType === "stream") {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer: Uint8Array[] = [];

        stream.on("data", (chunk: any) => {
          responseBuffer.push(chunk);

          if (maxContentLength! > -1 && Buffer.concat(responseBuffer).length > maxContentLength!) {
            stream.destroy();
            reject(
              createError(
                "maxContentLength size of" + maxContentLength + " exceeded",
                config,
                null,
                lastRequest
              )
            );
          }
        });

        stream.on("error", (err: any) => {
          if (req.aborted) return;
          reject(createError(err, config, null, lastRequest));
        });

        stream.on("end", () => {
          let responseData = Buffer.concat(responseBuffer);

          if (responseType !== "arraybuffer") {
            data = responseData.toString(responseEncoding);
          }
          response.data = data;
          settle(resolve, reject, response);
        });
      }
    });

    req.on("error", (err: any) => {
      if (req.aborted && err.code !== "ERR_FR_TOO_MANY_REDIRECTS") return;
      reject(createError(err, config, null, req));
    });

    if (timeout) {
      req.setTimeout(timeout, () => {
        req.abort();
        reject(createError("timeout of " + timeout + " ms exceeded", config, "ECONNABORTED", req));
      });
    }

    if (cancelToken) {
      cancelToken.promise.then((cancel) => {
        if (req.aborted) return;
        req.abort();
        reject(cancel);
      });
    }

    if (isStream(data)) {
      data
        .on("error", (err: any) => {
          reject(createError(err, config, null, req));
        })
        .pipe(req);
    } else {
      req.end(data);
    }
  });
}
