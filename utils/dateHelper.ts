export type DaysType = "1" | "2" | "3" | "4" | "5";

const getDayName = (hari: DaysType) => {
  const dayNames: { [key in DaysType]: string } = {
    "1": "Senin",
    "2": "Selasa",
    "3": "Rabu",
    "4": "Kamis",
    "5": "Jumat",
  };
  return dayNames[hari];
};

export { getDayName };
