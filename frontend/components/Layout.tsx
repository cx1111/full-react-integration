// The base layout template for the site
import React, { FunctionComponent } from "react";
import Head from "next/head";
import styled, { ThemeProvider } from "styled-components";
import { AuthProvider } from "../context/AuthContext";
import {
  ThemeProvider as ThemeModeProvider,
  ThemeContext,
} from "../context/ThemeContext";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import getThemeByName from "../themes/themes";
import NavBar from "./Navbar";

// Spacer for the fixed navbar
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

      <AuthProvider>
        <ThemeModeProvider>
          <ThemeContext.Consumer>
            {({ themeName }) => (
              <MuiThemeProvider theme={getThemeByName(themeName)}>
                <ThemeProvider theme={getThemeByName(themeName)}>
                  {/* TODO: remove? */}
                  <CssBaseline />
                  <NavBar />
                  <PlaceholderDiv />
                  <>{children}</>
                </ThemeProvider>
              </MuiThemeProvider>
            )}
          </ThemeContext.Consumer>
        </ThemeModeProvider>
      </AuthProvider>
    </>
  );
};

export default Layout;
