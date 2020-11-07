import React from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../../components/Layout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Container, Typography } from "@material-ui/core";
import {
  forumAPI,
  CreatePostResponse,
  CreatePostError,
} from "../../lib/endpoints/forum";
import { useFetch } from "../../hooks/useFetch";
import { isDefaultError, parseError } from "../../lib/endpoints/error";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "200px",
  },
}));

const NewPost: React.FC = ({}) => {
  const router = useRouter();
  const classes = useStyles();

  const [title, setTitle] = React.useState("");
  const [identifier, setIdentifier] = React.useState("");

  const [
    { error: createPostError, loading: createPostLoading },
    { setError: setCreatePostError, setLoading: setCreatePostLoading },
  ] = useFetch<CreatePostResponse, CreatePostError>({ loading: false });

  const attemptCreatePost = async () => {
    try {
      setCreatePostLoading(true);
      setCreatePostError(undefined);
      const response = await forumAPI.createPost({
        title,
        identifier,
      });

      router.push(`/posts/${response.data.id}`);
    } catch (e) {
      const errorInfo = parseError<CreatePostError>(e);
      if (isDefaultError(errorInfo)) {
        setCreatePostError({ non_field_errors: [errorInfo.detail] });
      } else {
        setCreatePostError(errorInfo);
      }
    } finally {
      setCreatePostLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant={"h2"} component={"h1"}>
          New Post
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            helperText={createPostError?.title ? createPostError.title[0] : ""}
            error={Boolean(createPostError?.title)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            helperText={
              createPostError?.identifier ? createPostError.identifier[0] : ""
            }
            error={Boolean(createPostError?.identifier)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {createPostError?.non_field_errors && (
            <Typography color={"error"}>
              {createPostError.non_field_errors[0]}
            </Typography>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => {
              e.preventDefault();
              attemptCreatePost();
            }}
            disabled={createPostLoading}
          >
            Create new post
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default NewPost;
