import Axios, { AxiosInstance } from "axios";

// Extract an error message from the error object from a failed request
// https://github.com/axios/axios#handling-errors
// TODO: Expand for non-axios error
export const parseError = (e?: any): string => {
  if (!e) {
    return "Something went wrong!";
  }
  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
  if (e.response && e.response.data) {
    // TODO: array
    console.log(e.response, e.response.data);

    if (typeof e.response.data.detail === "string") {
      return e.response.data.detail;
    }

    // Could be a string or an object
    return e.response.data;
  }
  // The request was made but no response was received
  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  // http.ClientRequest in node.js
  // if (e.request) {
  //   return e.request;
  // }
  // Something happened in setting up the request that triggered an Error
  if (e.message) {
    return e.message;
  }
  return "Something went wrong!";
};

// Singleton class to instantiate shared axios instance
let instance: CoreAPI;

class CoreAPI {
  request: AxiosInstance;

  constructor() {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
      throw new Error(
        `'NEXT_PUBLIC_BACKEND_URL' not configured in environment settings`
      );
    }
    if (!instance) {
      instance = this;
    }
    this.request = Axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    });
    return instance;
  }
}

export const API = new CoreAPI();
