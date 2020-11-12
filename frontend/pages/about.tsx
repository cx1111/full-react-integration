import React from "react";
import Link from "next/link";
import { Button, Container, Typography } from "@material-ui/core";
import Layout from "../components/Layout";

const About: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography component={"h1"} variant={"h2"}>
          About This Site
        </Typography>
        <div>This is a simple about page you can mess with to test things.</div>
        <div>You are in {location}</div>
        <Link href="/" as={`/`}>
          <Button component={"a"} variant="contained" color="primary">
            Return Home
          </Button>
        </Link>
      </Container>
    </Layout>
  );
};

export default About;
