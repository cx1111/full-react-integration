import Axios, { AxiosInstance } from "axios";

let instance: CoreAPI;

// Singleton class to instantiate shared axios instance
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
