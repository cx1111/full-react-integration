import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/Layout";
import CreatableSelect from "react-select/creatable";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Container, Typography } from "@material-ui/core";
import {
  forumAPI,
  CreatePostResponse,
  CreatePostError,
} from "../lib/endpoints/forum";
import { useFetch } from "../hooks/useFetch";
import { isDefaultError, parseError } from "../lib/endpoints/error";
import { AuthContext } from "../context/AuthContext";
import { ProtectedRoute } from "../components/RouteAuth";

interface Option {
  value: string;
  label: string;
}

const suggestedTopics: Option[] = [
  { value: "black", label: "Black" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "yellow", label: "Yellow" },
];

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
  const { accessToken } = React.useContext(AuthContext);
  const classes = useStyles();

  const [title, setTitle] = React.useState("");
  const [identifier, setIdentifier] = React.useState("");
  const [topics, setTopics] = React.useState<Option[]>([]);

  const [alreadyExistsLocation, setAlreadyExistsLocation] = React.useState("");

  const [
    { error: createPostError, loading: createPostLoading },
    { setError: setCreatePostError, setLoading: setCreatePostLoading },
  ] = useFetch<CreatePostResponse, CreatePostError>({ loading: false });

  const attemptCreatePost = async () => {
    if (!accessToken) {
      return;
    }

    setCreatePostLoading(true);
    setCreatePostError(undefined);
    setAlreadyExistsLocation("");

    try {
      const postExistsResponse = await forumAPI.checkPostExists({
        identifier,
      });
      if (postExistsResponse.data.post) {
        setAlreadyExistsLocation(`/posts/${postExistsResponse.data.post.id}`);
        setCreatePostLoading(false);
        return;
      }
    } catch (e) {}

    // Only try to create post if identifier does not already exist
    try {
      const response = await forumAPI.createPost(
        {
          title,
          identifier,
          topics: topics.map((t) => t.value),
        },
        accessToken
      );

      // Keep loading=true until redirect
      router.push(`/posts/${response.data.id}`);
    } catch (e) {
      const errorInfo = parseError<CreatePostError>(e);
      if (isDefaultError(errorInfo)) {
        setCreatePostError({ non_field_errors: [errorInfo.detail] });
      } else {
        setCreatePostError(errorInfo);
      }
      setCreatePostLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="md">
          <Typography variant={"h2"} component={"h1"}>
            New Post
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              helperText={
                createPostError?.title ? createPostError.title[0] : ""
              }
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
            <CreatableSelect
              placeholder={"Topics"}
              isMulti
              options={suggestedTopics}
              value={topics}
              onChange={(newValue: any, _actionMeta: any) => {
                setTopics(newValue);
              }}
            />
            {createPostError?.topics && (
              <Typography color={"error"}>
                {createPostError.topics[0]}
              </Typography>
            )}
            {createPostError?.non_field_errors && (
              <Typography color={"error"}>
                {createPostError.non_field_errors[0]}
              </Typography>
            )}
            {alreadyExistsLocation && (
              <Alert severity="info">
                A post with this identifier already exists. View it{" "}
                <Link href={alreadyExistsLocation}>here</Link>
              </Alert>
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
    </ProtectedRoute>
  );
};

export default NewPost;
