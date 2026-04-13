"use client";

import React from "react";
import { StatusPengajuan } from "@/types/pengajuan-sidang";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface StatusPengajuanBadgeProps {
  status: StatusPengajuan;
}

const StatusPengajuanBadge: React.FC<StatusPengajuanBadgeProps> = ({
  status,
}) => {
  const config = {
    menunggu: {
      icon: Clock,
      text: "Menunggu",
      className:
        "bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm",
      iconClass: "text-yellow-600",
    },
    disetujui: {
      icon: CheckCircle,
      text: "Disetujui",
      className:
        "bg-green-100 text-green-800 border border-green-200 shadow-sm",
      iconClass: "text-green-600",
    },
    ditolak: {
      icon: XCircle,
      text: "Ditolak",
      className: "bg-red-100 text-red-800 border border-red-200 shadow-sm",
      iconClass: "text-red-600",
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

export default StatusPengajuanBadge;
