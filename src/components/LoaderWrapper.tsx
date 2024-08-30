"use client";

import { useSession } from "next-auth/react";
import { Spinner } from "./LoadingSpinner";

export default function LoaderWrapper({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) {
  const { status } = useSession();

  if (status === "loading" || isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
