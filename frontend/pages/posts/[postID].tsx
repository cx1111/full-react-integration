import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import { Container, Typography } from "@material-ui/core";
import { useFetch } from "../../hooks/useFetch";
import { forumAPI, ViewPostResponse } from "../../lib/endpoints/forum";
import { parseError } from "../../lib/endpoints/utils";

export default function Posts({}) {
  const router = useRouter();
  const { postID } = router.query;

  if (!(typeof postID === "string" && postID.length)) {
    throw new Error("Something went wrong");
  }
  const [
    { data: postData, error: postError, loading: postLoading },
    {
      setData: setpostData,
      setError: setpostError,
      setLoading: setpostLoading,
    },
  ] = useFetch<ViewPostResponse>({ loading: false });

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        setpostLoading(true);
        const response = await forumAPI.viewPost(postID);
        setpostData(response.data);
      } catch (e) {
        setpostError(parseError(e));
        setpostData(undefined);
      } finally {
        setpostLoading(false);
      }
    };
    getPosts();
  }, []);

  return (
    <Layout>
      <Container maxWidth="lg">
        {postLoading && <p>Loading post...</p>}
        {postError && <p>Error loading post: {postError}</p>}
        {postData && (
          <>
            <Typography variant={"h1"} component={"h2"}>
              {postData.title}
            </Typography>
            <p>{postData.identifier}</p>
            <p>Author: {postData.author.username}</p>
            <p>Created At: {postData.created_at}</p>
            <Link href={"/posts"}>Back to Posts</Link>
          </>
        )}
      </Container>
    </Layout>
  );
}
