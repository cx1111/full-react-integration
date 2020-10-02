// The base layout template for the site
import React, { FunctionComponent } from "react";
import Head from "next/head";
import styled, { ThemeProvider } from "styled-components";
// import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuIcon from "@material-ui/icons/Menu";
import { GlobalStyle, materialTheme, dark, light } from "../styles/GlobalStyle";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

// For the fixed navbar
const PlaceholderDiv = styled.div({ marginBottom: "80px" });

type LayoutProps = {
  title?: string;
};

const Layout: FunctionComponent<LayoutProps> = ({
  title = "React Django App",
  children,
}) => {
  return (
    <>
      {/* Specify HTML head fields here */}
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        {/* For material-ui mobile */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* Base global styling */}

      <MuiThemeProvider theme={dark}>
        <ThemeProvider theme={dark}>
          {/* Build upon material-ui baseline */}
          <CssBaseline />
          <GlobalStyle />
          <AppBar position="fixed">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">React Django</Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
          <PlaceholderDiv />
          <>{children}</>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  );
};

export default Layout;
