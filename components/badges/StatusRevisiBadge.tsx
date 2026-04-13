"use client";

import React from "react";
import { StatusRevisi } from "@/types/bap";
import { Clock, FileEdit, CheckCircle } from "lucide-react";

interface StatusRevisiBadgeProps {
  status: StatusRevisi;
}

const StatusRevisiBadge: React.FC<StatusRevisiBadgeProps> = ({ status }) => {
  const config = {
    menunggu: {
      icon: Clock,
      text: "Menunggu",
      className:
        "bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm",
      iconClass: "text-yellow-600",
    },
    revisi: {
      icon: FileEdit,
      text: "Revisi",
      className: "bg-red-100 text-red-800 border border-red-200 shadow-sm",
      iconClass: "text-red-600",
    },
    selesai: {
      icon: CheckCircle,
      text: "Selesai",
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

export default StatusRevisiBadge;
