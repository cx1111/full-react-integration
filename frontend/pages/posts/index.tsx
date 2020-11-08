import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../../components/Layout";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import { Container, Typography } from "@material-ui/core";
import { useFetch } from "../../hooks/useFetch";
import { forumAPI, ListPostsResponse } from "../../lib/endpoints/forum";
import { parseError, DefaultErrorMessage } from "../../lib/endpoints/error";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
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

const Posts: React.FC = ({}) => {
  const classes = useStyles();
  const [
    { data: postsData, error: postsError, loading: postsLoading },
    {
      setData: setPostsData,
      setError: setPostsError,
      setLoading: setPostsLoading,
    },
  ] = useFetch<ListPostsResponse, DefaultErrorMessage>({ loading: false });

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        setPostsLoading(true);
        const response = await forumAPI.listPosts();
        setPostsData(response.data);
      } catch (e) {
        setPostsError(parseError(e));
        setPostsData(undefined);
      } finally {
        setPostsLoading(false);
      }
    };
    getPosts();
  }, [setPostsData, setPostsLoading, setPostsError]);

  return (
    <Layout>
      <Container maxWidth="lg">
        <Grid container spacing={10}>
          <Grid item xs={8}>
            <Typography variant={"h1"} component={"h1"}>
              All Posts
            </Typography>
            {postsLoading && <p>Loading posts...</p>}
            {postsError && <p>Error loading posts: {postsError.detail}</p>}
            {postsData ? (
              postsData.length ? (
                postsData.map((post) => (
                  <Card
                    className={classes.root}
                    variant="outlined"
                    key={post.id}
                  >
                    <CardContent>
                      <Link href={`/posts/${post.id}/`}>
                        <Typography variant="h5" component="h2">
                          {post.title}
                        </Typography>
                      </Link>
                      <Typography className={classes.pos} color="textSecondary">
                        Posted by {post.author.username} on{" "}
                        {displayDate(post.created_at)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No posts to show</p>
              )
            ) : null}
          </Grid>
          {/* Sidebar */}
          {/* <Grid item xs={4}>
            Hello everyone
          </Grid> */}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Posts;
