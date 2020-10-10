import Axios, { AxiosInstance, AxiosPromise } from "axios";
import {
  ListPostsParams,
  ListPostsResponse,
  ViewPostResponse,
  CreatePostParams,
  CreatePostResponse,
} from "./forum";

let instance: API;

class API {
  private request: AxiosInstance;

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

  viewPost = (postId: string): AxiosPromise<ViewPostResponse> =>
    this.request.get(`/api/post/${postId}`);

  createPost = (params: CreatePostParams): AxiosPromise<CreatePostResponse> =>
    this.request.post("/api/create-post/", { params });

  listPosts = (params?: ListPostsParams): AxiosPromise<ListPostsResponse> =>
    this.request.get("/api/posts/", { params });
}

export default new API();
