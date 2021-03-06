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
  topics: Topic[];
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

type Topic = {
  id: number;
  name: string;
  count: string;
};

// Request params
export type ListPostsParams = {
  username?: string;
};

// Response data
export type ListPostsResponse = Post[];

export type CheckPostExistsParams = {
  identifier: string;
};

export type CheckPostExistsResponse = {
  post: Post | null;
};

export type ViewPostResponse = Post;

export type CreatePostParams = {
  identifier: string;
  title: string;
  topics: string[];
};

export interface CreatePostError extends SerializerError {
  title?: string[];
  identifier?: string[];
  topics?: string[];
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

export type ListTopicsResponse = Topic[];

export type ListFollowedTopicsResponse = Topic[];

export type FollowTopicParams = {
  topic_id: string;
};

class ForumAPI {
  viewPost = (postId: string): AxiosPromise<ViewPostResponse> =>
    API.request.get(`/api/post/${postId}`);

  createPost = (
    params: CreatePostParams,
    accessToken: string
  ): AxiosPromise<CreatePostResponse> =>
    API.request.post(
      "/api/create-post/",
      { ...params },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

  listPosts = (params?: ListPostsParams): AxiosPromise<ListPostsResponse> =>
    API.request.get("/api/posts/", { params });

  checkPostExists = (
    params?: CheckPostExistsParams
  ): AxiosPromise<CheckPostExistsResponse> =>
    API.request.get("/api/post-exists/", { params });

  // List top-level comments
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

  listTopics = (): AxiosPromise<ListTopicsResponse> =>
    API.request.get("/api/topics/");

  listFollowedTopics = (
    accessToken: string
  ): AxiosPromise<ListFollowedTopicsResponse> =>
    API.request.get("/api/followed-topics/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  followTopic = (topicId: number, accessToken: string): AxiosPromise<unknown> =>
    API.request.post(
      `/api/topic/${topicId}/follow/`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

  unfollowTopic = (
    topicId: number,
    accessToken: string
  ): AxiosPromise<unknown> =>
    API.request.post(
      `/api/topic/${topicId}/unfollow/`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
}

export const forumAPI = new ForumAPI();
