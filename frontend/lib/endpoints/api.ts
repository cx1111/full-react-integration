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
    console.log(process.env);
    if (!process.env.BACKEND_URL) {
      throw new Error(`'BACKEND_URL' not configured in environment settings ${process.env.NODE_ENV}`);
    }
    if (!instance) {
      instance = this;
    }
    this.request = Axios.create({
      baseURL: process.env.BACKEND_URL,
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
