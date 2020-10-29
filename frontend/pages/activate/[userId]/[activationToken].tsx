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
import { userAPI, RegisterError } from "../lib/endpoints/user";
import { useFetch } from "../hooks/useFetch";
import { parseError, isDefaultError } from "../lib/endpoints/error";
import { NoAuthRoute } from "../components/RouteAuth";

enum ValidStatus {
  Unknown = 0,
  Yes,
  No,
}

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

const ActivateAccount: React.FC = ({}) => {
  const classes = useStyles();

  const router = useRouter();
  const userID =
    typeof router.query.userID === "string" ? router.query.userID : "";
  const activationToken =
    typeof router.query.activationToken === "string"
      ? router.query.activationToken
      : "";

  // Whether the uid and activation token are valid
  const [paramsValid, setParamsValid] = React.useState<ValidStatus>(
    ValidStatus.Unknown
  );

  //   const [registerSuccess, setRegisterSuccess] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  const [
    { error: registerError, loading: activateLoading },
    { setError: setActivateError, setLoading: setactivateLoading },
  ] = useFetch<any, RegisterError>({ loading: false });

  // Check whether the
  const checkActivationParams = React.useCallback(async () => {
    try {
      setactivateLoading(true);
      setActivateError(undefined);
      await userAPI.register({
        email,
        username,
      });
      setParamsValid(ValidStatus.Yes);
    } catch (e) {
      const errorInfo = parseError<RegisterError>(e);
      if (isDefaultError(errorInfo)) {
        setActivateError({ non_field_errors: [errorInfo.detail] });
      } else {
        setActivateError(errorInfo);
      }
    } finally {
      setactivateLoading(false);
    }
  }, []);

  React.useEffect(() => {
    checkActivationParams();
  }, [checkActivationParams]);

  const attemptActivate = async () => {
    try {
      setactivateLoading(true);
      setActivateError(undefined);
      await userAPI.register({
        email,
        username,
      });
      setParamsValid(ValidStatus.Yes);
    } catch (e) {
      const errorInfo = parseError<RegisterError>(e);
      if (isDefaultError(errorInfo)) {
        setActivateError({ non_field_errors: [errorInfo.detail] });
      } else {
        setActivateError(errorInfo);
      }
    } finally {
      setactivateLoading(false);
    }
  };

  if (paramsValid === ValidStatus.No) {
    return (
      <Layout>
        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5">
            Invalid Activation Link
          </Typography>
          <Typography>This activation link is invalid.</Typography>
        </Container>
      </Layout>
    );
  }

  //   if (registerSuccess) {
  //     return (
  //       <Layout>
  //         <Container component="main" maxWidth="xs">
  //           <Typography component="h1" variant="h5">
  //             Activation Complete!
  //           </Typography>
  //           <Typography>
  //             Your account has been activated. You may now log in.
  //           </Typography>
  //         </Container>
  //       </Layout>
  //     );
  //   }

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
                  attemptActivate();
                }}
                disabled={activateLoading}
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

export default ActivateAccount;
