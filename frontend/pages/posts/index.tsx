import React from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { Container, Typography } from "@material-ui/core";
import API from "../../lib/endpoints/api";
import { useFetch } from "../../hooks/useFetch";
import { ListPostsResponse } from "../../lib/endpoints/forum";
import { parseError } from "../../lib/endpoints/utils";

export default function Posts({}) {
  const [
    { data: postsData, error: postsError, loading: postsLoading },
    {
      setData: setPostsData,
      setError: setPostsError,
      setLoading: setPostsLoading,
    },
  ] = useFetch<ListPostsResponse>({ loading: false });

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        setPostsLoading(true);
        const response = await API.listPosts();
        setPostsData(response.data);
      } catch (e) {
        setPostsError(parseError(e));
        setPostsData(undefined);
      } finally {
        setPostsLoading(false);
      }
    };
    getPosts();
  }, []);

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant={"h1"} component={"h2"}>
          Posts
        </Typography>
        {postsLoading && <p>Loading posts...</p>}
        {postsError && <p>Error loading posts: {postsError}</p>}
        {postsData &&
          postsData.map((p) => {
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
