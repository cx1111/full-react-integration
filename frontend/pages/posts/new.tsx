import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../../components/Layout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "next/link";
import { Container, Typography } from "@material-ui/core";
import { useMutation, MutationFunction } from "react-query";
import {
  forumAPI,
  CreatePostParams,
  CreatePostResponse,
  CreatePostError,
} from "../../lib/endpoints/forum";
import { parseError } from "../../lib/endpoints/error";

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
  const classes = useStyles();

  const [title, setTitle] = React.useState("");
  const [identifier, setIdentifier] = React.useState("");

  const [a] = useMutation;

  const [addTodo, { status, data, error }] = useMutation<
    Promise<CreatePostResponse>,
    CreatePostError,
    CreatePostParams
  >(
    async (params: CreatePostParams) => {
      const x = forumAPI.createPost(params).then((res) => res.data);
      return x;
    },
    {
      onSuccess: () => {
        alert("yay");
      },
    }
  );

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant={"h2"} component={"h1"}>
          New Post
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            // helperText={loginError?.username ? loginError.username[0] : ""}
            // error={Boolean(loginError?.username)}
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
            // helperText={loginError?.username ? loginError.username[0] : ""}
            // error={Boolean(loginError?.username)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => {
              e.preventDefault();
              //   attemptLogin();
            }}
            // disabled={loginLoading}
          >
            Create new post
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default NewPost;
