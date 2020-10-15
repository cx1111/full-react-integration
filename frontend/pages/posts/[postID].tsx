import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import { Container, Typography } from "@material-ui/core";
import { useFetch } from "../../hooks/useFetch";
import {
  forumAPI,
  ViewPostResponse,
  ListPostCommentsResponse,
} from "../../lib/endpoints/forum";
import { parseError } from "../../lib/endpoints/utils";
import { displayDate } from "../../lib/utils/date";

export default function Posts({}) {
  const router = useRouter();
  const { postID } = router.query;

  if (!(typeof postID === "string" && postID.length)) {
    throw new Error("Something went wrong");
  }
  const [
    { data: postData, error: postError, loading: postLoading },
    {
      setData: setPostData,
      setError: setPostError,
      setLoading: setPostLoading,
    },
  ] = useFetch<ViewPostResponse>({ loading: false });

  const [
    { data: commentsData, error: commentsError, loading: commentsLoading },
    {
      setData: setCommentsData,
      setError: setCommentsError,
      setLoading: setCommentsLoading,
    },
  ] = useFetch<ListPostCommentsResponse>({ loading: false });

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        setPostLoading(true);
        const response = await forumAPI.viewPost(postID);
        setPostData(response.data);
      } catch (e) {
        setPostError(parseError(e));
        setPostData(undefined);
      } finally {
        setPostLoading(false);
      }
    };
    getPosts();
  }, []);

  React.useEffect(() => {
    const getComments = async () => {
      try {
        setCommentsLoading(true);
        const response = await forumAPI.listPostComments(postID);
        setCommentsData(response.data);
      } catch (e) {
        setCommentsError(parseError(e));
        setCommentsData(undefined);
      } finally {
        setCommentsLoading(false);
      }
    };
    getComments();
  }, []);

  return (
    <Layout>
      <Container maxWidth="lg">
        {postLoading && <p>Loading post...</p>}
        {postError && <p>Error loading post: {postError}</p>}
        {postData && (
          <>
            <Typography component={"h1"} variant={"h2"}>
              {postData.title}
            </Typography>
            <p>Identifier: {postData.identifier}</p>
            <p>
              Created by: {postData.author.username} at{" "}
              {displayDate(postData.created_at)}
            </p>
            <Link href={"/posts"}>Back to Posts</Link>
          </>
        )}
        <hr />
        {commentsLoading && <p>Loading comments...</p>}
        {commentsError && <p>Error loading comments: {commentsError}</p>}
        {commentsData && (
          <>
            {commentsData.map((comment) => (
              <>
                <div>{comment.content}</div>
                <div>{comment.author.username}</div>
              </>
            ))}
          </>
        )}
      </Container>
    </Layout>
  );
}
