import React from "react";

const RevisiBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={`inline-flex items-center justify-center font-medium text-center select-none
      bg-[#FEE2E2] rounded-[11px]
      w-[68px] h-[26px] px-[10px] py-[4px]
      text-[#EF4444] text-sm
      font-sans
      ${className || ""}
    `}
    style={{
      boxSizing: "border-box",
    }}
  >
    Revisi
  </span>
);

export default RevisiBadge;