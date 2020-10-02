import { Theme } from "@material-ui/core";

import darkTheme from "./dark";
import lightTheme from "./light";
import defaultTheme from "./default";

export default function getThemeByName(theme: string): Theme {
  return themeMap[theme];
}

const themeMap: { [key: string]: Theme } = {
  defaultTheme,
  darkTheme,
  lightTheme,
};
