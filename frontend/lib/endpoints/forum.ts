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
