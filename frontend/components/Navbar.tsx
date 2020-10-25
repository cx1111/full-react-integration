// The base layout template for the site
import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
import AccountCircle from "@material-ui/icons/AccountCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

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
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <NoSsr>
      <ThemeContext.Consumer>
        {({ themeName, toggleThemeName }) => (
          <AuthContext.Consumer>
            {({ user, clearAuthInfo }) => (
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
                  <Link href={"/about"}>
                    <Button color="inherit">About</Button>
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
                  {user ? (
                    <div>
                      <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        anchorPosition={{ top: 1100, left: 100 }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <Link href="/profile">
                          <MenuItem>View Profile</MenuItem>
                        </Link>
                        <MenuItem onClick={handleClose}>
                          Manage Account (TBD)
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            clearAuthInfo();
                            router.push("/");
                          }}
                        >
                          Log Out
                        </MenuItem>
                      </Menu>
                    </div>
                  ) : (
                    <Link href={"/login"}>
                      <Button color="inherit">Log In</Button>
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
