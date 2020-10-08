type Post = {
  id: string;
  identifier: string;
  title: string;
  author: {
    username: string;
  };
  created_at: Date;
};

export type ViewPostParams = {
  identifier: string;
};

export type ViewPostResponse = Post;

export type CreatePostParams = {
  identifier: string;
  title: string;
};

export type CreatePostResponse = Post;

export type ListPostsParams = {
  username?: string;
};

export type ListPostsResponse = Post[];
