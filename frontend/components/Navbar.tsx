// The base layout template for the site
import React, { FC } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  NoSsr,
} from "@material-ui/core";
import SwitchUI from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((_theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const NavBar: FC = () => {
  const classes = useStyles();

  return (
    <NoSsr>
      <ThemeContext.Consumer>
        {({ themeName, toggleThemeName }) => (
          <AuthContext.Consumer>
            {({ accessToken }) => (
              <AppBar position="fixed" className={classes.root}>
                <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                  </IconButton>
                  <Link href={"/"}>
                    <Typography variant="h6" className={classes.title}>
                      Full React Integration
                    </Typography>
                  </Link>
                  <FormControlLabel
                    control={
                      <SwitchUI
                        checked={themeName === "light"}
                        onChange={toggleThemeName}
                      />
                    }
                    label="Light Mode"
                  />
                  {accessToken ? (
                    <Button color="inherit">Logout</Button>
                  ) : (
                    <Link href={"/login"}>
                      <Button color="inherit">Login</Button>
                    </Link>
                  )}
                </Toolbar>
              </AppBar>
            )}
          </AuthContext.Consumer>
        )}
      </ThemeContext.Consumer>
    </NoSsr>
  );
};

export default NavBar;
