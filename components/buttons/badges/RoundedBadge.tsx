import { Badge } from "@/components/ui/badge";

const RoundedBadge: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 rounded-xl text-white ${className}`}
    >
      {children}
    </Badge>
  );
};

export default RoundedBadge;
