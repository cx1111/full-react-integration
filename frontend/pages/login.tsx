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
import { userAPI, GetTokenError } from "../lib/endpoints/user";
import { AuthContext } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { parseError, isDefaultError } from "../lib/endpoints/error";
import { NoAuthRoute } from "../components/RouteAuth";

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
  const router = useRouter();
  const { setAuthInfo } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [
    { error: loginError, loading: loginLoading },
    { setError: setLoginError, setLoading: setLoginLoading },
  ] = useFetch<any, GetTokenError>({ loading: false });

  const attemptLogin = async () => {
    try {
      setLoginLoading(true);
      setLoginError(undefined);
      const tokenResponse = await userAPI.getToken({
        username,
        password,
      });
      const userResponse = await userAPI.viewUser(tokenResponse.data.access);

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
      router.push("/");
    } catch (e) {
      const errorInfo = parseError<GetTokenError>(e);
      if (isDefaultError(errorInfo)) {
        setLoginError({ non_field_errors: [errorInfo.detail] });
      } else {
        setLoginError(errorInfo);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <NoAuthRoute>
      <Layout>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                helperText={loginError?.username ? loginError.username[0] : ""}
                error={Boolean(loginError?.username)}
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
                helperText={loginError?.password ? loginError.password[0] : ""}
                error={Boolean(loginError?.password)}
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
              {loginError?.non_field_errors && (
                <Typography color={"error"}>
                  {loginError.non_field_errors[0]}
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
                  attemptLogin();
                }}
                disabled={loginLoading}
              >
                Log In
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
      </Layout>
    </NoAuthRoute>
  );
};

export default Login;
