import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StatusBimbingan } from "@/types/bimbingan";
import { Clock, CheckCircle, XCircle, PlayCircle } from "lucide-react";

interface StatusBimbinganBadgeProps {
  status: StatusBimbingan;
  className?: string;
}

const StatusBimbinganBadge: React.FC<StatusBimbinganBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "scheduled":
        return {
          label: "Terjadwal",
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: Clock,
        };
      case "ongoing":
        return {
          label: "Berlangsung",
          color: "bg-green-100 text-green-700 border-green-200",
          icon: PlayCircle,
        };
      case "completed":
        return {
          label: "Selesai",
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Dibatalkan",
          color: "bg-red-100 text-red-700 border-red-200",
          icon: XCircle,
        };
      case "no_show":
        return {
          label: "Tidak Hadir",
          color: "bg-orange-100 text-orange-700 border-orange-200",
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5",
        config.color,
        className
      )}
      variant="outline"
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBimbinganBadge;
