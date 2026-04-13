"use client";

import RedButton from "@/components/buttons/RedButton";
import YellowButton from "@/components/buttons/YellowButton";
import { MdDateRange } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import GetCurrentRoute from "@/utils/GetCurrentRoute";

const JadwalCard: React.FC<{
  type: string;
  date: string;
  timeRange: string;
  desc: string;
}> = ({ type, date, timeRange, desc }) => {
  return (
    <div className="bg-gray-background rounded-lg shadow-md p-6 relative">
      {/* Title */}
      <h3 className="font-bold text-gray-800 mb-3">{type}</h3>

      {/* Date and Time Information */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <MdDateRange className="w-4 h-4 text-black" />
          <span className="text-gray-600 text-sm">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MdAccessTimeFilled className="w-4 h-4 text-black" />
          <span className="text-gray-600 text-sm">{timeRange}</span>
        </div>
      </div>

      {/* Event Description Area */}
      <div className="bg-secondary rounded-md p-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-md"></div>
        <p className="text-gray-700 ml-3">{desc}</p>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <YellowButton url={`${GetCurrentRoute()}/`} className="px-4">
          Edit
        </YellowButton>
        <RedButton url={`${GetCurrentRoute()}/`} className="px-4">
          Hapus
        </RedButton>
      </div>
    </div>
  );
};

export default JadwalCard;
