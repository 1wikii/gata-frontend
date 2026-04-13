import React from "react";

const DiterimaBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={`inline-flex items-center justify-center font-medium text-center select-none
      bg-[#E8F5E8] border border-[#C8E6C9] rounded-[11px]
      w-[80px] h-[26px] px-[10px] py-[4px]
      text-[#167772] text-sm
      font-sans
      ${className || ""}
    `}
    style={{
      boxSizing: "border-box",
    }}
  >
    Diterima
  </span>
);

export default DiterimaBadge;