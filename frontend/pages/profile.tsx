import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Layout from "../components/Layout";
import { Container, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { AuthContext } from "../context/AuthContext";
// import { ProtectedRoute } from "../context/ProtectedRoute";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Profile: React.FC = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  const { user, authLoading } = React.useContext(AuthContext);
  console.log("base", authLoading, user, process.browser);

  if (authLoading) {
    // console.log(router.pathname);
    return <div>Wait...</div>;
  }
  if (!authLoading && !user) {
    console.log("damn", authLoading, user, process.browser);
    // Error: No router instance found. you should only use "next/router" inside the client side of your app.
    if (process.browser) {
      router.push("/login");
      return null;
    }
    return <div>Wait...</div>;
  }

  return (
    // <ProtectedRoute>
    <AuthContext.Consumer>
      {({ user }) => (
        <Layout>
          <Container maxWidth="lg">
            <Typography variant={"h1"} component={"h1"}>
              Your Profile
            </Typography>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  Username: {user && user.username}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Email: {user && user.email}
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </Layout>
      )}
    </AuthContext.Consumer>
    // </ProtectedRoute>
  );
};

export default Profile;
