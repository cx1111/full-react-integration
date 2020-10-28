import React from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { userAPI } from "../lib/endpoints/user";
import { useFetch } from "../hooks/useFetch";
import { parseError } from "../lib/endpoints/utils";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register: React.FC = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  // TODO: Move this into common component for login and register
  // const { user } = React.useContext(AuthContext);

  const [email, setEmail] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");

  const [
    { error: registerError, loading: registerLoading },
    { setError: setRegisterError, setLoading: setRegisterLoading },
  ] = useFetch<any>({ loading: false });

  const attemptRegister = async () => {
    try {
      setRegisterLoading(true);
      setRegisterError("");
      await userAPI.register({
        email,
        username,
      });
      router.push("/");
    } catch (e) {
      setRegisterError(parseError(e));
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create New Account
          </Typography>
          <form className={classes.form}>
            <TextField
              // helperText="Email"
              // error={true}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username (4-20 characters)"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {registerError && <p>Error creating account: {registerError}</p>}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(e) => {
                e.preventDefault();
                attemptRegister();
              }}
              disabled={registerLoading}
            >
              Create Account
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Log In with Existing Account"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default Register;
