// "use client";

import { useSession } from "next-auth/react";
import { Spinner } from "./LoadingSpinner";
import { getCurrentSession } from "@/lib/actions";

export default async function LoaderWrapper({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) {
  // const { status } = useSession();
  const { loading } = await getCurrentSession();

  if (loading || isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
