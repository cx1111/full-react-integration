import React from "react";
import { useRouter } from "next/router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Layout from "../../../components/Layout";
import { userAPI, ActivateUserError } from "../../../lib/endpoints/user";
import { useFetch } from "../../../hooks/useFetch";
import { parseError, isDefaultError } from "../../../lib/endpoints/error";
import { NoAuthRoute } from "../../../components/RouteAuth";
import { getGenericReducer } from "../../../lib/utils/reducer";

interface ActivateFields {
  password1: string;
  password2: string;
}

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
  const uidb64 =
    typeof router.query.uidb64 === "string" ? router.query.uidb64 : undefined;
  const activationToken =
    typeof router.query.activationToken === "string"
      ? router.query.activationToken
      : undefined;

  // Whether the uid and activation token are valid
  const [paramsValid, setParamsValid] = React.useState<ValidStatus>(
    ValidStatus.Unknown
  );

  // TODO: Check API returns username and email?
  //   const [registerSuccess, setRegisterSuccess] = React.useState(false);

  const [activateFields, setActivateFields] = React.useReducer(
    getGenericReducer<ActivateFields>(),
    {
      password1: "",
      password2: "",
    }
  );

  const [
    { error: activateError, loading: activateLoading },
    { setError: setActivateError, setLoading: setActivateLoading },
  ] = useFetch<any, ActivateUserError>({ loading: false });

  // Check whether the uid and activation token are valid
  //   const checkActivationParams = React.useCallback(, [uidb64, activationToken]);

  React.useEffect(() => {
    const checkActivationParams = async (uid: string, token: string) => {
      try {
        await userAPI.checkActivation({
          uidb64: uid,
          token,
        });
        setParamsValid(ValidStatus.Yes);
      } catch (e) {
        // No need to display the details. Just show that the link is invalid
        // TODO: deal with server down?
        setParamsValid(ValidStatus.No);
      }
    };

    console.log("yo", uidb64, activationToken);
    // TODO: Figure out proper condition to call this
    if (uidb64 && activationToken) {
      console.log("in", uidb64, activationToken);
      checkActivationParams(uidb64, activationToken);
    }
  }, [uidb64, activationToken, paramsValid]);

  const attemptActivate = async () => {
    if (!uidb64 || !activationToken) {
      return;
    }
    try {
      setActivateLoading(true);
      setActivateError(undefined);
      await userAPI.activateUser({
        uidb64,
        token: activationToken,
        password1: activateFields.password1,
        password2: activateFields.password2,
      });
    } catch (e) {
      const errorInfo = parseError<ActivateUserError>(e);
      if (isDefaultError(errorInfo)) {
        setActivateError({ non_field_errors: [errorInfo.detail] });
      } else {
        setActivateError(errorInfo);
      }
    } finally {
      setActivateLoading(false);
    }
  };

  if (paramsValid === ValidStatus.Unknown) {
    return null;
  } else if (paramsValid === ValidStatus.No) {
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

  return (
    <NoAuthRoute redirectTo={"/"}>
      <Layout>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Activate Account
            </Typography>
            <form className={classes.form}>
              <TextField
                // helperText={activateError?.email ? activateError.email[0] : ""}
                // error={Boolean(activateError?.email)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                name="password1"
                autoFocus
                value={activateFields.password1}
                onChange={(e) =>
                  setActivateFields({ password1: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                name="password2"
                value={activateFields.password2}
                onChange={(e) =>
                  setActivateFields({ password2: e.target.value })
                }
              />
              {activateError?.non_field_errors && (
                <Typography color={"error"}>
                  {activateError.non_field_errors[0]}
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
