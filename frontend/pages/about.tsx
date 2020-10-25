import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Button, Container, Typography } from "@material-ui/core";
import Layout from "../components/Layout";

interface Props {
  location: string;
}

const About: React.FC<Props> = ({ location }) => {
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      location: "USA",
    },
  };
};
