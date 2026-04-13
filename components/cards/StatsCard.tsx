import React from "react";

interface StatsCardProps {
  title1?: string;
  title2?: string;
  value: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title1,
  value,
  title2,
  className,
}) => {
  return (
    <div
      className={`bg-gray-background rounded-lg shadow-md p-6 flex flex-col items-center text-center ${className}`}
    >
      <span className="text-primary text-sm font-medium mb-2">{title1}</span>
      <span className="text-2xl font-bold text-primary mb-2">{value}</span>
      <span className="text-gray-500 text-sm">{title2}</span>
    </div>
  );
};

export default StatsCard;
