import React from "react";
import { Container, Typography } from "@material-ui/core";
import { remove } from "lodash";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Link from "next/link";
import Layout from "components/Layout";
import { useFetch } from "hooks/useFetch";
import {
  forumAPI,
  ViewPostResponse,
  ListPostCommentsResponse,
  ListCommentRepliesResponse,
  CreateCommentResponse,
  CreateCommentError,
} from "lib/endpoints/forum";
import {
  parseError,
  DefaultErrorMessage,
  isDefaultError,
} from "lib/endpoints/error";
import { displayDate } from "lib/utils/date";
import { AuthContext } from "context/AuthContext";

const useStyles = makeStyles((theme) => ({
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
  repliesSection: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(10),
    width: "500px",
  },
  replyForm: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
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
  },
  fixedButton: {
    width: "120px",
  },
}));

interface Props {
  postData: ViewPostResponse | null;
  postError: DefaultErrorMessage | null;
  commentsData: ListPostCommentsResponse | null;
  commentsError: DefaultErrorMessage | null;
}

const Posts: React.FC<Props> = ({
  postData,
  postError,
  commentsData: initialCommentsData,
  commentsError: initialCommentsError,
}) => {
  const router = useRouter();
  const { accessToken, isAuthenticated } = React.useContext(AuthContext);
  const postID =
    typeof router.query.postID === "string" ? router.query.postID : "";
  const classes = useStyles();

  // Top-level comments
  const [
    { data: commentsData, error: commentsError, loading: commentsLoading },
    {
      setData: setCommentsData,
      setError: setCommentsError,
      setLoading: setCommentsLoading,
    },
  ] = useFetch<ListPostCommentsResponse, DefaultErrorMessage>({
    data: initialCommentsData || undefined,
    error: initialCommentsError || undefined,
    loading: false,
  });

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
        setCommentsError(errorInfo);
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

  // Id of comment to focus reply comment field
  const [focusReply, setFocusReply] = React.useState<string | null>(null);

  // Set the status of showing replies to a comment
  const setShowReply = (commentId: string, status: boolean) => {
    // Show
    if (status) {
      if (!replies[commentId]) {
        loadReplies(commentId);
      }
      setShowReplies((prevShowReplies) => [...prevShowReplies, commentId]);
    }
    // Hide
    else {
      setFocusReply(null);
      setShowReplies((prevShowReplies) => {
        const newShowReplies = remove(
          prevShowReplies,
          (el: string) => el !== commentId
        );
        return newShowReplies;
      });
    }
  };

  // Dictionary of text fields for new replies. Key is parent comment id.
  const [newReplies, setNewReplies] = React.useState<Record<string, string>>(
    {}
  );

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
      setNewReplies({});
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
            {/* <Paper component="ul"> */}
            <div>
              {postData.topics.map((topic) => {
                return (
                  // <li key={topic.name}>
                  <Chip
                    key={topic.name}
                    // icon={icon}
                    label={topic.name}
                    color={"secondary"}
                    // onDelete={
                    //   data.label === "React" ? undefined : handleDelete(data)
                    // }
                    // className={classes.chip}
                  />
                  // </li>
                );
              })}
            </div>
            {/* </Paper> */}

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
          {commentsError && (
            <p>Error loading comments: {commentsError.detail}</p>
          )}
          {commentsData && (
            <>
              {commentsData.map((comment) => (
                <Card className={classes.commentCard} key={comment.id}>
                  <CardContent>
                    <Typography className={classes.pos} color="textSecondary">
                      {`${comment.author.username} - ${displayDate(
                        comment.created_at
                      )}`}
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
                    {isAuthenticated && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          setShowReply(comment.id, true);
                          setFocusReply(comment.id);
                        }}
                      >
                        Reply
                      </Button>
                    )}
                    {Boolean(comment.num_replies) && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          setShowReply(
                            comment.id,
                            !showReplies.includes(comment.id)
                          );
                        }}
                      >
                        {showReplies.includes(comment.id)
                          ? "Hide Replies"
                          : `${comment.num_replies} ${
                              comment.num_replies > 1 ? "Replies" : "Reply"
                            }`}
                      </Button>
                    )}
                  </CardActions>
                  {/* Replies */}
                  {showReplies.includes(comment.id) && replies[comment.id] && (
                    <CardActions>
                      <div className={classes.repliesSection}>
                        {/* Reply form */}
                        {isAuthenticated ? (
                          <form className={classes.replyForm}>
                            <TextField
                              multiline
                              rows={4}
                              value={newReplies[comment.id] || ""}
                              onChange={(e) =>
                                setNewReplies({
                                  ...newReplies,
                                  [comment.id]: e.target.value,
                                })
                              }
                              required
                              autoFocus={focusReply === comment.id}
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
                              classes={{
                                root: classes.fixedButton,
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                postComment(newReplies[comment.id], comment.id);
                              }}
                              disabled={createCommentLoading}
                            >
                              Post Reply
                            </Button>
                          </form>
                        ) : (
                          <p>
                            <Link href={"/login"}>Log in</Link> to comment
                          </p>
                        )}
                        {replies[comment.id].map((reply) => (
                          <Card key={reply.id} className={classes.commentCard}>
                            <CardContent>
                              <Typography
                                className={classes.pos}
                                color="textSecondary"
                              >
                                {`${reply.author.username} - ${displayDate(
                                  reply.created_at
                                )}`}
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
                      </div>
                    </CardActions>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>
        <div className={classes.commentForm}>
          {isAuthenticated ? (
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
                type="submit"
                variant="contained"
                color="primary"
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  let postData: ViewPostResponse | null = null;
  let postError: DefaultErrorMessage | null = null;

  let commentsData: ListPostCommentsResponse | null = null;
  let commentsError: DefaultErrorMessage | null = null;

  if (typeof context.params?.postID === "string") {
    try {
      const response = await forumAPI.viewPost(context.params.postID);
      postData = response.data;
    } catch (e) {
      postError = parseError(e);
    }

    // Load top-level comments
    try {
      const response = await forumAPI.listPostComments(context.params.postID);
      commentsData = response.data;
    } catch (e) {
      commentsError = parseError(e);
    }
  }

  return {
    props: {
      postData,
      postError,
      commentsData,
      commentsError,
    },
  };
};
