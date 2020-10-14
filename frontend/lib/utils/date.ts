import { parseISO, format } from "date-fns";

export const displayDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "LLLL d, yyyy");
};
