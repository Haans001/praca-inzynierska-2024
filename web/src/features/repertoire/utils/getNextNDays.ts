export const getNextNDays = (n: number): string[] => {
  const today = new Date();
  const next7Days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    next7Days.push(`${year}-${month}-${day}`);
  }

  return next7Days;
};
