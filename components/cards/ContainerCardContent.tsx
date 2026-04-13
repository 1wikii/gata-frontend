import React from "react";

const ContainerCardContent: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={`w-full rounded-xl p-4 py-6 shadow-md border-none ${className}`}
    >
      {children}
    </div>
  );
};

export default ContainerCardContent;
