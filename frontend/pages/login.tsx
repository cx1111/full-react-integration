import React from "react";
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
import { AuthContext } from "../context/AuthContext";
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

const Login: React.FC = ({}) => {
  const classes = useStyles();

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [
    { error: loginError, loading: loginLoading },
    { setError: setLoginError, setLoading: setLoginLoading },
  ] = useFetch<any>({ loading: false });

  return (
    <Layout>
      <AuthContext.Consumer>
        {({ setAuthInfo }) => {
          const attemptLogin = async () => {
            try {
              setLoginLoading(true);
              setLoginError("");
              const tokenResponse = await userAPI.getToken({
                username,
                password,
              });
              const userResponse = await userAPI.viewUser(
                tokenResponse.data.access
              );

              // Shows null user. Should never happen.
              if (!userResponse.data.user) {
                throw new Error("Something went wrong");
              }
              setAuthInfo({
                accessToken: tokenResponse.data.access,
                refreshToken: tokenResponse.data.refresh,
                user: {
                  username: userResponse.data.user.username,
                  email: userResponse.data.user.email,
                },
              });
            } catch (e) {
              setLoginError(parseError(e));
            } finally {
              setLoginLoading(false);
            }
          };

          return (
            <Container component="main" maxWidth="xs">
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form className={classes.form} noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {loginError && <p>Error logging in: {loginError}</p>}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={attemptLogin}
                    disabled={loginLoading}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Create Account"}
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Container>
          );
        }}
      </AuthContext.Consumer>
    </Layout>
  );
};

export default Login;
