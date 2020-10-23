import React from "react";
import Link from "next/link";
import { Button, Container, Typography } from "@material-ui/core";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";

const Home: React.FC = ({}) => {
  return (
    <Layout>
      <AuthContext.Consumer>
        {({ accessToken, refreshToken, setAuthInfo, clearAuthInfo }) => (
          <Container maxWidth="lg">
            <Typography component={"h1"} variant={"h2"}>
              Welcome to the Jungle
            </Typography>
            <Link href="/posts" as={`/posts`}>
              <Button component={"a"} variant="contained" color="primary">
                View Posts
              </Button>
            </Link>
            <p>Your access token is: {accessToken}</p>
            <p>Your refresh token is: {refreshToken}</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                setAuthInfo({
                  accessToken: "eyaoeifjoiajef",
                  refreshToken: "oajeifoajieofijaoeijfoiej",
                  user: {
                    username: "fake",
                    email: "fake@gmail.com",
                  },
                })
              }
            >
              Set Auth
            </Button>
            <Button variant="contained" color="primary" onClick={clearAuthInfo}>
              Clear Auth
            </Button>
          </Container>
        )}
      </AuthContext.Consumer>
    </Layout>
  );
};

export default Home;
