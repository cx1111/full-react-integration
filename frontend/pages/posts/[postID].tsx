import React from "react";
import { Container, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import CardContent from "@material-ui/core/CardContent";
import { useFetch } from "../../hooks/useFetch";
import {
  forumAPI,
  ViewPostResponse,
  ListPostCommentsResponse,
} from "../../lib/endpoints/forum";
import { parseError } from "../../lib/endpoints/utils";
import { displayDate } from "../../lib/utils/date";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function Posts({}) {
  const router = useRouter();
  const { postID } = router.query;
  const classes = useStyles();

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
        {commentsLoading && <p>Loading comments...</p>}
        {commentsError && <p>Error loading comments: {commentsError}</p>}
        {commentsData && (
          <>
            {commentsData.map((comment) => (
              <Card className={classes.root}>
                <CardContent>
                  <Typography className={classes.pos} color="textSecondary">
                    {`${comment.author.username} - ${displayDate(
                      comment.created_at
                    )}`}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {comment.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Container>
    </Layout>
  );
}
