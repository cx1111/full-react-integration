import { AxiosPromise } from "axios";
import { API } from "./utils";

type Post = {
  id: string;
  identifier: string;
  title: string;
  author: {
    username: string;
  };
  created_at: string;
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

class ForumAPI {
  viewPost = (postId: string): AxiosPromise<ViewPostResponse> =>
    API.request.get(`/api/post/${postId}`);

  createPost = (params: CreatePostParams): AxiosPromise<CreatePostResponse> =>
    API.request.post("/api/create-post/", { params });

  listPosts = (params?: ListPostsParams): AxiosPromise<ListPostsResponse> =>
    API.request.get("/api/posts/", { params });
}

export const forumAPI = new ForumAPI();
