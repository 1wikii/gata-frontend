import { ReactNode } from "react";

interface NavbarButtonProps {
  children: ReactNode;
  className?: string;
}

export default function NavbarFooterButton({
  children,
  className,
}: NavbarButtonProps) {
  return (
    <button
      className={`p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
