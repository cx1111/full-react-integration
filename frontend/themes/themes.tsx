import { Theme } from "@material-ui/core";

import darkTheme from "./dark";
import lightTheme from "./light";
import defaultTheme from "./default";

// TODO create a theme map so that we don't have to import all of the themes at compile time

export function getThemeByName(theme: string): Theme {
  return themeMap[theme];
}

const themeMap: { [key: string]: Theme } = {
  defaultTheme,
  darkTheme,
  lightTheme,
};
