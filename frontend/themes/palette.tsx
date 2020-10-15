import { ThemeOptions } from "@material-ui/core/styles";

export const darkTheme: ThemeOptions = {
  palette: {
    type: "dark",
  },
};

export const lightTheme: ThemeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#a400",
    },
    background: {
      default: "#fff",
    },
  },
};
