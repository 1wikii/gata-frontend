import React from "react";

const ProposalBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={`inline-flex items-center justify-center font-medium text-center select-none
      bg-[#FEF3C7] rounded-[12px]
      w-[120px] h-[26px] px-[10px] py-[4px]
      text-[#F59E0B] text-sm
      font-sans
      ${className || ""}
    `}
    style={{
      boxSizing: "border-box",
    }}
  >
    Proposal
  </span>
);

export default ProposalBadge;