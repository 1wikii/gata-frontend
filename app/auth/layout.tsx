"use client";

import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function DosenPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);

    if (token) {
      const user = JSON.parse(atob(token.split(".")[1]));

      if (user?.role === "admin") {
        router.replace("/admin");
      } else if (user?.role === "lecturer") {
        router.replace("/dosen");
      } else if (user?.role === "student") {
        router.replace("/mahasiswa");
      }
    } else {
      setIsLoading(false);
    }
  }, [hasToken, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (pathname.endsWith("/token-expired")) {
    return <>{children}</>;
  } else {
    return <>{!hasToken && children}</>;
  }
}
