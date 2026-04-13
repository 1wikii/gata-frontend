"use client";

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface StatusPenilaianBadgeProps {
  status: "belum-dinilai" | "sudah-dinilai";
}

const StatusPenilaianBadge: React.FC<StatusPenilaianBadgeProps> = ({
  status,
}) => {
  const config = {
    "belum-dinilai": {
      icon: XCircle,
      text: "Belum Dinilai",
      className: "bg-gray-100 text-gray-800 border border-gray-200 shadow-sm",
      iconClass: "text-gray-600",
    },
    "sudah-dinilai": {
      icon: CheckCircle,
      text: "Sudah Dinilai",
      className:
        "bg-green-100 text-green-800 border border-green-200 shadow-sm",
      iconClass: "text-green-600",
    },
  };

  const { icon: Icon, text, className, iconClass } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 ${iconClass}`} />
      {text}
    </span>
  );
};

export default StatusPenilaianBadge;
