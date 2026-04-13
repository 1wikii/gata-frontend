"use client";

import { usePathname } from "next/navigation";

const GetCurrentRoute = (): string => {
  const pathname = usePathname();
  if (!pathname) return "/";
  return pathname;
};

export default GetCurrentRoute;
