import React from "react";
import { Container, Typography } from "@material-ui/core";
// import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
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
  CreateCommentResponse,
  CreateCommentError,
} from "../../lib/endpoints/forum";
import { parseError, isDefaultError } from "../../lib/endpoints/error";
import { displayDate } from "../../lib/utils/date";
import { AuthContext } from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
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
  commentForm: {
    marginTop: theme.spacing(1),
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
    alignItems: "left",
  },
}));

const Posts: React.FC = ({}) => {
  const router = useRouter();
  const { accessToken } = React.useContext(AuthContext);
  const postID =
    typeof router.query.postID === "string" ? router.query.postID : "";
  const classes = useStyles();

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
    // TODO: 404 page?
    const getPosts = async () => {
      if (postID === "") {
        return;
      }
      try {
        setPostLoading(true);
        const response = await forumAPI.viewPost(postID);
        setPostData(response.data);
      } catch (e) {
        const errorInfo = parseError<null>(e);
        if (errorInfo) {
          setPostError(errorInfo.detail);
        }
        setPostData(undefined);
      } finally {
        setPostLoading(false);
      }
    };
    getPosts();
  }, [postID, setPostData, setPostLoading, setPostError]);

  const loadComments = React.useCallback(async () => {
    if (postID === "") {
      return;
    }
    try {
      setCommentsLoading(true);
      const response = await forumAPI.listPostComments(postID);
      setCommentsData(response.data);
    } catch (e) {
      const errorInfo = parseError<null>(e);
      if (errorInfo) {
        setCommentsError(errorInfo.detail);
      }
      setCommentsData(undefined);
    } finally {
      setCommentsLoading(false);
    }
  }, [postID, setCommentsData, setCommentsLoading, setCommentsError]);

  React.useEffect(() => {
    loadComments();
  }, [loadComments]);

  const [newComment, setNewComment] = React.useState<string>("");

  const [
    {
      // data: createCommentData,
      error: createCommentError,
      loading: createCommentLoading,
    },
    {
      // setData: setCreateCommentData,
      setError: setCreateCommentError,
      setLoading: setCreateCommentLoading,
    },
  ] = useFetch<CreateCommentResponse, CreateCommentError>({ loading: false });

  const postComment = async () => {
    console.log("step 1", postID, accessToken);
    if (postID === "" || !accessToken) {
      return;
    }
    try {
      console.log("trying");
      setCreateCommentLoading(true);
      setCreateCommentError(undefined);
      const createCommentResponse = await forumAPI.createComment(
        {
          content: newComment,
          post: postID,
          is_reply: false,
          parent_comment: null,
        },
        accessToken
      );

      // Some success alert
      console.log(createCommentResponse.data);
      loadComments();
      alert("Your comment has been posted!");
    } catch (e) {
      const errorInfo = parseError<CreateCommentError>(e);
      if (isDefaultError(errorInfo)) {
        setCreateCommentError({ non_field_errors: [errorInfo.detail] });
      } else {
        setCreateCommentError(errorInfo);
      }
    } finally {
      setCreateCommentLoading(false);
    }
  };

  if (postID === "") {
    return null;
  }

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
            <hr />
          </>
        )}
        {commentsLoading && <p>Loading comments...</p>}
        {commentsError && <p>Error loading comments: {commentsError}</p>}
        {commentsData && (
          <>
            {commentsData.map((comment) => (
              <Card className={classes.root} key={comment.id}>
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
        <div className={classes.commentForm}>
          {accessToken ? (
            <form className={classes.form}>
              <TextField
                multiline
                rows={6}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                variant="outlined"
                margin="normal"
              />
              {createCommentError?.non_field_errors && (
                <Typography color={"error"}>
                  {createCommentError.non_field_errors[0]}
                </Typography>
              )}
              <Button
                // fullWidth={false}
                type="submit"
                variant="contained"
                color="primary"
                // className={classes.submit}
                onClick={(e) => {
                  e.preventDefault();
                  postComment();
                }}
                disabled={createCommentLoading}
              >
                Post Comment
              </Button>
            </form>
          ) : (
            <>Log in to comment</>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default Posts;
