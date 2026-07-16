export const formatYear = (date: Date) => String(date.getUTCFullYear());

export const formatRange = (start: Date, end?: Date) =>
  `${formatYear(start)} — ${end ? formatYear(end) : "Present"}`;
