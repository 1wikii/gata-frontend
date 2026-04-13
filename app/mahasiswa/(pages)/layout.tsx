"use client";

import React, { useState } from "react";
import Navigation from "@/components/ui/navigation";

export default function MahasiswaPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}
