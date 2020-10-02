import { createMuiTheme } from "@material-ui/core/styles";

export const defaultTheme = createMuiTheme({
  palette: {
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
});

export default defaultTheme;
