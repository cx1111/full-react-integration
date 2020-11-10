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
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Brightness4 from "@material-ui/icons/Brightness4";
import Brightness7 from "@material-ui/icons/Brightness7";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    cursor: "pointer",
    marginRight: theme.spacing(2),
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  navSide: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

const NavBar: FC = () => {
  const classes = useStyles();
  const { user } = React.useContext(AuthContext);
  const { themeName, toggleThemeName } = React.useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        {/* Left side */}
        <div className={classes.navSide}>
          {/* Site icon goes here */}
          <Link href={"/"}>
            <IconButton color="inherit">
              <WhatshotIcon />
            </IconButton>
          </Link>
          <Link href={"/"}>
            <Typography variant="h6" className={classes.title}>
              Full React Integration
            </Typography>
          </Link>
          <Link href={"/posts"}>
            <Button color="inherit">Posts</Button>
          </Link>
          {user && (
            <>
              <Link href={"/create-post"}>
                <Button color="inherit">New Post</Button>
              </Link>
              <Link href={"/follow"}>
                <Button color="inherit">Follow</Button>
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className={classes.navSide}>
          <Link href={"/about"}>
            <Button color="inherit">About</Button>
          </Link>
          <Tooltip title="Toggle light/dark">
            <IconButton color="inherit" onClick={toggleThemeName}>
              {themeName === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
          {user ? (
            <div>
              <Tooltip title="Account">
                <IconButton
                  aria-label="account settings"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
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
                <MenuItem onClick={handleClose}>Manage Account (TBD)</MenuItem>
                <Link href="/logout">
                  <MenuItem>Log Out</MenuItem>
                </Link>
              </Menu>
            </div>
          ) : (
            <div>
              <Tooltip title="Login/Register">
                <IconButton
                  aria-label="account links"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <ExitToApp />
                </IconButton>
              </Tooltip>
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
                <Link href={"/login"}>
                  <MenuItem>Log In</MenuItem>
                </Link>
                <Link href={"/register"}>
                  <MenuItem>Register</MenuItem>
                </Link>
              </Menu>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
