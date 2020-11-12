import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GetServerSideProps } from "next";
import Link from "next/link";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { Container, Typography } from "@material-ui/core";
import Layout from "components/Layout";
import { forumAPI, ListPostsResponse } from "lib/endpoints/forum";
import { parseError, DefaultErrorMessage } from "lib/endpoints/error";
import { displayDate } from "lib/utils/date";

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

interface Props {
  postsData: ListPostsResponse | null;
  postsError: DefaultErrorMessage | null;
}

const Posts: React.FC<Props> = ({ postsData, postsError }) => {
  const classes = useStyles();

  return (
    <Layout>
      <Container maxWidth="lg">
        <Grid container spacing={10}>
          <Grid item xs={8}>
            <Typography variant={"h1"} component={"h1"}>
              All Posts
            </Typography>
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

export const getServerSideProps: GetServerSideProps = async () => {
  let postsData: ListPostsResponse | null = null;
  let postsError: DefaultErrorMessage | null = null;
  try {
    const response = await forumAPI.listPosts();
    postsData = response.data;
  } catch (e) {
    postsError = parseError(e);
  }

  return {
    props: {
      postsData,
      postsError,
    },
  };
};
