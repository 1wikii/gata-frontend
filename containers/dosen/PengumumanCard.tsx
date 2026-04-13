import { GoDotFill } from "react-icons/go";

const PengumumanCard: React.FC<{
  title: string;
  desc: string;
  date: string;
}> = ({ title, desc, date }) => {
  return (
    <div className="grid grid-cols-[auto_1fr] bg-secondary p-4 rounded-lg shadow-sm">
      <div className="px-2 py-1">
        <GoDotFill className="text-green" />
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-600 text-justify">{desc}</p>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
    </div>
  );
};

export default PengumumanCard;
