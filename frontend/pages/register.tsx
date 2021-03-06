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
import { userAPI, RegisterError } from "../lib/endpoints/user";
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

const Register: React.FC = ({}) => {
  const classes = useStyles();

  const [registerSuccess, setRegisterSuccess] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  const [
    { error: registerError, loading: registerLoading },
    { setError: setRegisterError, setLoading: setRegisterLoading },
  ] = useFetch<any, RegisterError>({ loading: false });

  const attemptRegister = async () => {
    try {
      setRegisterLoading(true);
      setRegisterError(undefined);
      await userAPI.register({
        email,
        username,
      });
      setRegisterSuccess(true);
    } catch (e) {
      const errorInfo = parseError<RegisterError>(e);
      if (isDefaultError(errorInfo)) {
        setRegisterError({ non_field_errors: [errorInfo.detail] });
      } else {
        setRegisterError(errorInfo);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  if (registerSuccess) {
    return (
      <Layout>
        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5">
            Registration Successful!
          </Typography>
          <Typography>
            Your account has been created. Follow the instructions in the email
            sent to your address to activate your account.
          </Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <NoAuthRoute redirectTo={"/"}>
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
                helperText={registerError?.email ? registerError.email[0] : ""}
                error={Boolean(registerError?.email)}
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
                helperText={
                  registerError?.username ? registerError.username[0] : ""
                }
                error={Boolean(registerError?.username)}
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
              {registerError?.non_field_errors && (
                <Typography color={"error"}>
                  {registerError.non_field_errors[0]}
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
    </NoAuthRoute>
  );
};

export default Register;
