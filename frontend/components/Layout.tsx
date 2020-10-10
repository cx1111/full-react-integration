// The base layout template for the site
import React, { FunctionComponent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styled, { ThemeProvider } from "styled-components";
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

const useStyles = makeStyles((theme) => ({
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

  // TODO Move to its own Context?
  // TODO Save to localStorage so that this persists through refresh
  // TODO Save to User so that this persists through login/logout
  const [currentTheme, setTheme] = useState(getThemeByName("lightTheme"));
  const [currentThemeName, setThemeName] = useState("darkTheme");
  const isDark = Boolean(currentThemeName === "darkTheme");

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      setThemeName("darkTheme");
    } else {
      setThemeName("lightTheme");
    }
    setTheme(getThemeByName(currentThemeName));
  };

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

      <MuiThemeProvider theme={currentTheme}>
        <ThemeProvider theme={currentTheme}>
          <CssBaseline />
          {/* TODO Pull the AppBar into its own component file */}
          <NoSsr>
            <AppBar position="fixed" className={classes.root}>
              <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <Link href={"/"}>
                  <Typography variant="h6" className={classes.title}>
                    React Django
                  </Typography>
                </Link>
                <ThemeSwitcher
                  control={
                    <SwitchUI checked={isDark} onChange={handleThemeChange} />
                  }
                  label="Light Mode"
                />
                <Button color="inherit">Login</Button>
              </Toolbar>
            </AppBar>
          </NoSsr>
          <PlaceholderDiv />
          <>{children}</>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  );
};

export default Layout;
