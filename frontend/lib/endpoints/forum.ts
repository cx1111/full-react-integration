type Post = {
  id: string;
  identifier: string;
  title: string;
  author: {
    username: string;
  };
  created_at: Date;
};

export interface ViewPostParams {
  identifier: string;
}

export interface ViewPostResponse extends Post {}

export interface CreatePostParams {
  identifier: string;
  title: string;
}

export interface CreatePostResponse extends Post {}

export interface ListPostsParams {
  username?: string;
}

export type ListPostsResponse = Post[]

type Aaa = {
  a: string;
};

type Bbb = Aaa[];

const xx: Bbb = [{ a: "hi" }];
