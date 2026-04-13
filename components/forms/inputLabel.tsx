export default function InputLabel({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <label
      className={`text-sm font-medium text-gray-900 tracking-tight ${className}`}
    >
      {label}
    </label>
  );
}
