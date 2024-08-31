"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  isRelatedProjects?: boolean;
  className?: string;
  showButton: boolean;
  buttonTitle?: string;
  link?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Results not found",
  subtitle = "No projects found, go create some first.",
  showButton,
  isRelatedProjects,
  className,
  link = "/",
  buttonTitle = "Create one now",
}) => {
  const router = useRouter();
  const session = useSession();
  return (
    <div
      className={cn(
        "h-[60vh]  flex flex-col justify-center items-center gap-2",
        className
      )}
    >
      <div className={"text-center"}>
        <div className="text-2xl font-bold">{title}</div>
        <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
      </div>

      {!isRelatedProjects && showButton && (
        <div className="w-48 mt-4">
          <Button
            onClick={() => {
              if (session.status === "unauthenticated") {
                signIn("google", { callbackUrl: link });
                return;
              }
              router.push(link);
            }}
            variant={"outline"}
            size={"lg"}
            className="w-48 mt-4"
          >
            {buttonTitle}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
