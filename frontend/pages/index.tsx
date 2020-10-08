import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { Button, Container } from "@material-ui/core";
import { StyledButton } from "../components/basic/Button";

export default function Home({}) {
  return (
    <Layout>
      <Container maxWidth="lg">
        <p>
          (This is a sample website - you’ll be building a site like this in{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
        <p>
          Click here to see the{" "}
          <Link href="/demointro" as={`/demointro`}>
            <a>demo intro page</a>
          </Link>
        </p>
        <p>
          Click here to see the{" "}
          <Link href="/posts" as={`/posts`}>
            <a>posts</a>
          </Link>
        </p>
        <Button variant="contained" color="primary">
          This does nothing
        </Button>
        <StyledButton>Click Me</StyledButton>
      </Container>
    </Layout>
  );
}
