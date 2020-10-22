import { Theme } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

import { baseTypography } from "./typography";
import { darkTheme, lightTheme } from "./palette";

export default function getThemeByName(theme: string): Theme {
  return themeMap[theme];
}

const themeMap: { [key: string]: Theme } = {
  dark: createMuiTheme({ ...baseTypography, ...darkTheme }),
  light: createMuiTheme({ ...baseTypography, ...lightTheme }),
};
