import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { Button, Container, Link as MuiLink } from "@material-ui/core";
import { StyledButton } from "../components/basic/Button";

export default function Home({}) {
  return (
    <Layout>
      <Container maxWidth="lg">
        <p>
          (This is a sample website - you’ll be building a site like this in{" "}
          <MuiLink href="https://nextjs.org/learn">
            <a>our Next.js tutorial</a>
          </MuiLink>
          .)
        </p>
        <p>
          Click here to see the{" "}
          <Link href="/demointro" as={`/demointro`} passHref>
            <MuiLink>
              <a>demo intro page</a>
            </MuiLink>
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
