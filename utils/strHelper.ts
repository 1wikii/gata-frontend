const formatDate = (unFormated: string): any => {
  const date = new Date(unFormated);
  // format tanggka format indonesia
  const dateString = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  // format waktu (jam:menit)
  const timeString = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    tanggal: dateString,
    waktu: timeString,
  };
};

const capitalize1st = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { formatDate, capitalize1st };
