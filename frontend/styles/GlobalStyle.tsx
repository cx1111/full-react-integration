// Custom global styling
import { createGlobalStyle } from "styled-components";
import { fontSizes } from "./constants/fontSizes";
import { example } from "./constants/colors";

export const GlobalStyle = createGlobalStyle({
  body: {
    color: example,
    fontSize: fontSizes.regular,
  },
});
