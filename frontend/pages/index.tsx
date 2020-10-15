import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import {
  Button,
  Container,
  Link as MuiLink,
  Typography,
} from "@material-ui/core";

export default function Home({}) {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography component={"h1"} variant={"h2"}>
          Welcome to the Jungle
        </Typography>
        <p>
          Click here to see the{" "}
          <Link href="/demointro" as={`/demointro`} passHref>
            <MuiLink>
              <a>demo intro page</a>
            </MuiLink>
          </Link>
        </p>
        <Link href="/posts" as={`/posts`}>
          <Button component={"a"} variant="contained" color="primary">
            View Posts
          </Button>
        </Link>
      </Container>
    </Layout>
  );
}
