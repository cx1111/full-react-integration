import React from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { Container } from "@material-ui/core";
import API from "../../lib/endpoints/api";
import { ListPostsParams, ListPostsResponse } from "../../lib/endpoints/forum";

export default function Posts({}) {
  const [posts, setPosts] = React.useState<ListPostsResponse>([]);

  React.useEffect(() => {
    const getPosts = async () => {
      const response = await API.listPosts();
      setPosts(response.data);
    };

    getPosts();
  }, []);

  return (
    <Layout>
      <Container maxWidth="lg">
        <p>All Posts</p>
        {posts.map((p) => {
          return (
            <p>
              <Link href="/demointro" as={`/demointro`}>
                <a>{p.title}</a>
              </Link>
            </p>
          );
        })}
      </Container>
    </Layout>
  );
}
