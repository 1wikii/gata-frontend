import React from "react";
import ContainerCardContent from "@/components/cards/ContainerCardContent";

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, children }) => {
  return (
    <ContainerCardContent className="bg-gray-background">
      <h3 className="text-blue-700 font-bold text-base mb-2 uppercase">
        {title}
      </h3>
      <div className="text-gray-700 text-base">{children}</div>
    </ContainerCardContent>
  );
};

export default InfoBox;
