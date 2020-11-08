// DRF serializers pass this key for non-field errors
export interface SerializerError {
  non_field_errors?: string[];
}

// DRF will use the 'detail' key for errors by default
export interface DefaultErrorMessage {
  detail: string;
}

export function isDefaultError(
  errorInfo: DefaultErrorMessage | unknown
): errorInfo is DefaultErrorMessage {
  return (errorInfo as DefaultErrorMessage).detail !== undefined;
}

// Extract an error message from the error object from a failed request
// https://github.com/axios/axios#handling-errors
// TODO: Expand for non-axios error
/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/
export function parseError<T>(e?: any): DefaultErrorMessage | T {
  if (!e) {
    return { detail: "Something went wrong!" };
  }
  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
  if (e.response && e.response.data) {
    if (typeof e.response.data.detail === "string") {
      return { detail: e.response.data.detail };
    }

    if (typeof e.response.data === "string") {
      return { detail: e.response.data };
    }
    // Could be an object
    return e.response.data;
  }

  // Something happened in setting up the request that triggered an Error
  if (e.message && typeof e.message === "string") {
    return { detail: e.message };
  }
  return { detail: "Something went wrong!" };
}
