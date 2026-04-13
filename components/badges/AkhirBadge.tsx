import React from "react";

const AkhirBadge: React.FC<{ className?: string }> = ({ className }) => (
    <span
        className={`inline-flex items-center justify-center font-medium text-center select-none
            bg-[#305CF4] border border-[#305CF4] rounded-[11px]
            w-[120px] h-[26px] px-[10px] py-[4px]
            text-[#FFFFFF] text-sm
            font-poppins
            ${className || ""}
        `}
        style={{
            boxSizing: "border-box",
        }}
    >
        Akhir
    </span>
);

export default AkhirBadge;