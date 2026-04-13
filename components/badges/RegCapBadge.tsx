import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RegCapBadgeProps {
  tipe: "regular" | "capstone";
  className?: string;
}

const RegCapBadge: React.FC<RegCapBadgeProps> = ({ tipe, className }) => {
  return (
    <Badge
      className={cn(
        "px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tipe === "regular"
          ? "bg-blue-100 text-blue-700 border-blue-200"
          : "bg-purple-100 text-purple-700 border-purple-200",
        className
      )}
      variant="outline"
    >
      {tipe === "regular" ? "Reguler" : "Capstone"}
    </Badge>
  );
};

export default RegCapBadge;
