import Axios, { AxiosInstance, AxiosPromise } from "axios";
import {
  ViewPostParams,
  ViewPostResponse,
  CreatePostParams,
  CreatePostResponse,
  ListPostsParams,
  ListPostsResponse,
} from "./forum";

let instance: API;

class API {
  private request: AxiosInstance;

  constructor() {
    // if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    //   throw new Error(`'NEXT_PUBLIC_BACKEND_URL' not configured in environment settings`);
    // }

    // Next.js error: https://github.com/vercel/next.js/discussions/12754
    const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000/";
    if (!instance) {
      instance = this;
    }
    this.request = Axios.create({
      //   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      baseURL: url,
    });

    return instance;
  }

  viewPost = (params: ViewPostParams): AxiosPromise<ViewPostResponse> =>
    this.request.get(`/api/post/${params.identifier}`);

  createPost = (params: CreatePostParams): AxiosPromise<CreatePostResponse> =>
    this.request.post("/api/create-post/", { params });

  listPosts = (params?: ListPostsParams): AxiosPromise<ListPostsResponse> =>
    this.request.get("/api/posts/", { params });
}

export default new API();
