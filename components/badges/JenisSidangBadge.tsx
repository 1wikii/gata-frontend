"use client";

import React from "react";
import { JenisSidang } from "@/types/pengajuan-sidang";
import { FileText, Presentation, Award } from "lucide-react";

interface JenisSidangBadgeProps {
  jenis: JenisSidang;
}

const JenisSidangBadge: React.FC<JenisSidangBadgeProps> = ({ jenis }) => {
  const config = {
    proposal: {
      icon: FileText,
      text: "Proposal",
      className: "bg-blue-100 text-blue-800 border border-blue-200 shadow-sm",
      iconClass: "text-blue-600",
    },
    hasil: {
      icon: Presentation,
      text: "Hasil",
      className:
        "bg-purple-100 text-purple-800 border border-purple-200 shadow-sm",
      iconClass: "text-purple-600",
    },
    tutup: {
      icon: Award,
      text: "Tutup",
      className:
        "bg-orange-100 text-orange-800 border border-orange-200 shadow-sm",
      iconClass: "text-orange-600",
    },
  };

  const { icon: Icon, text, className, iconClass } = config[jenis];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 ${iconClass}`} />
      {text}
    </span>
  );
};

export default JenisSidangBadge;
