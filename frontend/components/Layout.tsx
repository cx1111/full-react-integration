// The base layout template for the site
import React, { FunctionComponent } from "react";
import Head from "next/head";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeContext } from "../context/ThemeContext";
import { ThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import getThemeByName from "../themes/themes";
import NavBar from "./Navbar";

const useStyles = makeStyles((_theme) => ({
  // Spacer for the fixed navbar
  navpad: {
    marginBottom: "80px",
  },
}));

type LayoutProps = {
  title?: string;
};

const Layout: FunctionComponent<LayoutProps> = ({
  title = "React Django App",
  children,
}) => {
  const { themeName } = React.useContext(ThemeContext);
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
      <ThemeProvider theme={getThemeByName(themeName)}>
        <CssBaseline />
        <NavBar />
        <div className={classes.navpad} />
        <>{children}</>
      </ThemeProvider>
    </>
  );
};

export default Layout;
