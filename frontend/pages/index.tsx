import React from "react";
import Link from "next/link";
import { Button, Container, Typography } from "@material-ui/core";
import Layout from "../components/Layout";

const Home: React.FC = ({}) => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography component={"h1"} variant={"h2"}>
          Welcome to the Jungle
        </Typography>
        <Link href="/posts" as={`/posts`}>
          <Button component={"a"} variant="contained" color="primary">
            View Posts
          </Button>
        </Link>
      </Container>
    </Layout>
  );
};

export default Home;
