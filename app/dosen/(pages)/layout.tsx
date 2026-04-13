"use client";

import React from "react";
import Navigation from "@/components/ui/navigation";

export default function DosenPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}
