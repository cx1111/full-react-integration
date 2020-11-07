import { AxiosPromise } from "axios";
import { API } from "./coreapi";
import { SerializerError } from "./error";

type Post = {
  id: string;
  identifier: string;
  title: string;
  author: {
    username: string;
  };
  created_at: string;
};

type Comment = {
  id: string;
  content: string;
  post: string;
  parent_comment: string | null;
  num_replies: number;
  author: {
    username: string;
  };
  created_at: string;
  edited_at: string;
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

export interface CreatePostError extends SerializerError {
  title?: string[];
  identifier?: string[];
}

export type CreatePostResponse = Post;

export type ListPostCommentsResponse = Comment[];

export type ListCommentRepliesResponse = Comment[];

export type CreateCommentParams = {
  content: string;
  post: string;
  is_reply: boolean;
  parent_comment: string | null;
};

export type CreateCommentResponse = {
  id: string;
  content: string;
  // There are others...
};

export interface CreateCommentError extends SerializerError {
  content?: string[];
}

class ForumAPI {
  viewPost = (postId: string): AxiosPromise<ViewPostResponse> =>
    API.request.get(`/api/post/${postId}`);

  createPost = (params: CreatePostParams): AxiosPromise<CreatePostResponse> =>
    API.request.post("/api/create-post/", { params });

  listPosts = (params?: ListPostsParams): AxiosPromise<ListPostsResponse> =>
    API.request.get("/api/posts/", { params });

  // Top level comments
  listPostComments = (postId: string): AxiosPromise<ListPostCommentsResponse> =>
    API.request.get(`/api/post/${postId}/comments/`);

  listCommentReplies = (
    commentId: string
  ): AxiosPromise<ListCommentRepliesResponse> =>
    API.request.get(`/api/comment/${commentId}/replies/`);

  createComment = (
    params: CreateCommentParams,
    accessToken: string
  ): AxiosPromise<CreateCommentResponse> =>
    API.request.post(
      "/api/create-comment/",
      { ...params },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
}

export const forumAPI = new ForumAPI();
