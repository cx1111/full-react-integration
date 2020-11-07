import React from "react";
import { Container, Typography } from "@material-ui/core";
import { remove } from "lodash";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { useFetch } from "../../hooks/useFetch";
import {
  forumAPI,
  ViewPostResponse,
  ListPostCommentsResponse,
  ListCommentRepliesResponse,
  CreateCommentResponse,
  CreateCommentError,
} from "../../lib/endpoints/forum";
import { parseError, isDefaultError } from "../../lib/endpoints/error";
import { displayDate } from "../../lib/utils/date";
import { AuthContext } from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  showBreaks: {
    whiteSpace: "pre-line",
  },
  pos: {
    marginBottom: 12,
  },
  commentCard: {
    minWidth: 275,
    marginBottom: theme.spacing(2),
  },
  commentForm: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
    alignItems: "left",
  },
  repliesSection: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(10),
    width: "500px",
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

  // Top-level comments
  const [
    { data: commentsData, error: commentsError, loading: commentsLoading },
    {
      setData: setCommentsData,
      setError: setCommentsError,
      setLoading: setCommentsLoading,
    },
  ] = useFetch<ListPostCommentsResponse>({ loading: false });

  // Comment replies object/dictionary
  const [replies, setReplies] = React.useState<
    Record<string, ListCommentRepliesResponse>
  >({});

  // Load replies for a post
  const loadReplies = async (commentId: string) => {
    try {
      const repliesResponse = await forumAPI.listCommentReplies(commentId);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: repliesResponse.data,
      }));
    } catch (e) {
      console.log("Failed to get replies", e);
    }
  };

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

  // List of comment ids that are set to show replies
  // TODO: convert to dict
  const [showReplies, setShowReplies] = React.useState<string[]>([]);

  const toggleShowReply = (commentId: string) => {
    // Load replies if necessary
    if (!showReplies.includes(commentId) && !replies[commentId]) {
      loadReplies(commentId);
    }

    setShowReplies((prevShowReplies) => {
      // Hide replies
      if (prevShowReplies.includes(commentId)) {
        const newShowReplies = remove(
          prevShowReplies,
          (el: string) => el !== commentId
        );
        return newShowReplies;
      }
      // Show replies
      return [...prevShowReplies, commentId];
    });
  };

  // For leaving a new comment
  const [newReply, setNewReply] = React.useState<string>("");

  // For leaving a new top-level comment
  const [newComment, setNewComment] = React.useState<string>("");

  const [
    { error: createCommentError, loading: createCommentLoading },
    { setError: setCreateCommentError, setLoading: setCreateCommentLoading },
  ] = useFetch<CreateCommentResponse, CreateCommentError>({ loading: false });

  const postComment = async (content: string, parentComment: string | null) => {
    if (postID === "" || !accessToken) {
      return;
    }
    try {
      setCreateCommentLoading(true);
      setCreateCommentError(undefined);
      const _createCommentResponse = await forumAPI.createComment(
        {
          content,
          post: postID,
          is_reply: Boolean(parentComment),
          parent_comment: parentComment,
        },
        accessToken
      );

      if (parentComment) {
        loadReplies(parentComment);
      }
      // Always refresh top level comments. TODO: make robust to pagination.
      loadComments();
      setNewComment("");
      setNewReply("");
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
        {/* Comments section */}
        <div>
          <Typography component={"h2"} variant={"h3"}>
            Comments
          </Typography>
          {commentsLoading && <p>Loading comments...</p>}
          {commentsError && <p>Error loading comments: {commentsError}</p>}
          {commentsData && (
            <>
              {commentsData.map((comment) => (
                <Card className={classes.commentCard} key={comment.id}>
                  <CardContent>
                    <Typography className={classes.pos} color="textSecondary">
                      {`${comment.author.username} - ${displayDate(
                        comment.created_at
                      )} - ${comment.id}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="p"
                      className={classes.showBreaks}
                    >
                      {comment.content}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Reply
                    </Button>
                    {Boolean(comment.num_replies) && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          toggleShowReply(comment.id);
                        }}
                      >
                        {showReplies.includes(comment.id)
                          ? "Hide Replies"
                          : `${comment.num_replies} Replies`}
                      </Button>
                    )}
                  </CardActions>
                  {/* Replies */}
                  {showReplies.includes(comment.id) && replies[comment.id] && (
                    <CardActions>
                      <div className={classes.repliesSection}>
                        {replies[comment.id].map((reply) => (
                          <Card key={reply.id} className={classes.commentCard}>
                            <CardContent>
                              <Typography
                                className={classes.pos}
                                color="textSecondary"
                              >
                                {`${reply.author.username} - ${displayDate(
                                  reply.created_at
                                )} - ${reply.id}`}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="p"
                                className={classes.showBreaks}
                              >
                                {reply.content}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                        <div className={classes.commentForm}>
                          {accessToken ? (
                            <form className={classes.form}>
                              <TextField
                                multiline
                                rows={4}
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
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
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  postComment(newReply, comment.id);
                                }}
                                disabled={createCommentLoading}
                              >
                                Post Reply
                              </Button>
                            </form>
                          ) : (
                            <>
                              <Link href={"/login"}>Log in</Link> to comment
                            </>
                          )}
                        </div>
                      </div>
                    </CardActions>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>
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
                  postComment(newComment, null);
                }}
                disabled={createCommentLoading}
              >
                Post Comment
              </Button>
            </form>
          ) : (
            <>
              <Link href={"/login"}>Log in</Link> to comment
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default Posts;
