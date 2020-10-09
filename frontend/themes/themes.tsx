import { Theme } from "@material-ui/core";

import darkTheme from "./dark";
import lightTheme from "./light";

export default function getThemeByName(theme: string): Theme {
  return themeMap[theme];
}

const themeMap: { [key: string]: Theme } = {
  darkTheme,
  lightTheme,
};
