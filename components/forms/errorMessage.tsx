export default function ErrorValidation({
  error,
  className,
}: {
  error: any;
  className?: string;
}) {
  return (
    <p
      className={`text-red-500 italic text-sm mt-1 bg-red-50 border border-red-200 p-2 rounded-lg  ${className}`}
    >
      {error}
    </p>
  );
}
