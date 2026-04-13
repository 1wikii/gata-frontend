const JadwalSidangCard: React.FC<{
  title: string;
  subtitle: string;
  date: string;
  timeRange: string;
}> = ({ title, subtitle, date, timeRange }) => {
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-2">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-blue-500 font-medium">{date}</p>
          <p className="text-gray-600 text-sm">{timeRange}</p>
        </div>
      </div>
    </div>
  );
};

export default JadwalSidangCard;
