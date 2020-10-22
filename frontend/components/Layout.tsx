// The base layout template for the site
import React, { FunctionComponent } from "react";
import Head from "next/head";
import Link from "next/link";
import styled, { ThemeProvider } from "styled-components";
import { AuthProvider } from "../context/AuthContext";
import {
  ThemeProvider as ThemeModeProvider,
  ThemeContext,
} from "../context/ThemeContext";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  ThemeProvider as MuiThemeProvider,
  NoSsr,
} from "@material-ui/core";
import SwitchUI from "@material-ui/core/Switch";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import MenuIcon from "@material-ui/icons/Menu";
import getThemeByName from "../themes/themes";

// Spacer for the fixed navbar
const PlaceholderDiv = styled.div({ marginBottom: "80px" });

const useStyles = makeStyles((_theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const ThemeSwitcher = styled(FormControlLabel)``;

type LayoutProps = {
  title?: string;
};

const Layout: FunctionComponent<LayoutProps> = ({
  title = "React Django App",
  children,
}) => {
  const classes = useStyles();

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
            {({ themeName, toggleThemeName }) => (
              <MuiThemeProvider theme={getThemeByName(themeName)}>
                <ThemeProvider theme={getThemeByName(themeName)}>
                  <CssBaseline />
                  {/* TODO Pull the AppBar into its own component file */}
                  <NoSsr>
                    <AppBar position="fixed" className={classes.root}>
                      <Toolbar>
                        <IconButton
                          edge="start"
                          color="inherit"
                          aria-label="menu"
                        >
                          <MenuIcon />
                        </IconButton>
                        <Link href={"/"}>
                          <Typography variant="h6" className={classes.title}>
                            React Django
                          </Typography>
                        </Link>
                        <ThemeSwitcher
                          control={
                            <SwitchUI
                              checked={themeName === "dark"}
                              onChange={toggleThemeName}
                            />
                          }
                          label="Light Mode"
                        />
                        <Link href={"/login"}>
                          <Button color="inherit">Login</Button>
                        </Link>
                      </Toolbar>
                    </AppBar>
                  </NoSsr>
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
