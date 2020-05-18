import { createError } from "./createError";

export function settle(resolve: Function, reject: Function, response: any) {
  const { validateStatus } = response.config;
  if (!validateStatus || !response.status || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      createError(
        `Request failed with status code ${response.status}`,
        response.config,
        null,
        response.request,
        response
      )
    );
  }
}
