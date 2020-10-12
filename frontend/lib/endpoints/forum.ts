import { AxiosPromise } from "axios";
import { CoreAPI } from "./utils";

type Post = {
  id: string;
  identifier: string;
  title: string;
  author: {
    username: string;
  };
  created_at: Date;
};

// Request params
export type ListPostsParams = {
  username?: string;
};

// Response data
export type ListPostsResponse = Post[];

export type ViewPostResponse = Post;

export type CreatePostParams = {
  identifier: string;
  title: string;
};

export type CreatePostResponse = Post;

export abstract class ForumAPI extends CoreAPI {
  viewPost = (postId: string): AxiosPromise<ViewPostResponse> =>
    this.request.get(`/api/post/${postId}`);

  createPost = (params: CreatePostParams): AxiosPromise<CreatePostResponse> =>
    this.request.post("/api/create-post/", { params });

  listPosts = (params?: ListPostsParams): AxiosPromise<ListPostsResponse> =>
    this.request.get("/api/posts/", { params });
}
