// Custom global styling
import { createGlobalStyle } from "styled-components";
import { createMuiTheme } from "@material-ui/core/styles";
// import { red } from "@material-ui/core/colors";
import { fontSizes } from "./constants/fontSizes";
import { example } from "./constants/colors";

export const GlobalStyle = createGlobalStyle({
  body: {
    color: example,
    fontSize: fontSizes.regular,
  },
});

// Baseline theme instance of material-ui
export const materialTheme = createMuiTheme({
  // palette: {
  //   primary: {
  //     main: "#556cd6",
  //   },
  //   secondary: {
  //     main: "#19857b",
  //   },
  //   error: {
  //     main: red.A400,
  //   },
  //   background: {
  //     default: "#fff",
  //   },
  // },
});
