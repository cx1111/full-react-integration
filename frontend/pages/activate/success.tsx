import React from "react";
import Link from "next/link";
import { Container, Typography } from "@material-ui/core";
import Layout from "../../components/Layout";

const ActivateSuccess: React.FC = () => {
  return (
    <Layout title={"Account successfully activated"}>
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          Activation Complete!
        </Typography>
        <Typography>
          Your account has been activated. You may now{" "}
          <Link href={"/login"}>log in</Link>.
        </Typography>
      </Container>
    </Layout>
  );
};

export default ActivateSuccess;
