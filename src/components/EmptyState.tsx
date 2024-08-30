"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  isRelatedProjects?: boolean;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Results not found",
  subtitle = "No projects found, go create some first.",
  showCreateButton,
  isRelatedProjects,
  className,
}) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "h-[60vh]  flex flex-col justify-center items-center gap-2",className
      )}
    >
      <div className={"text-center"}>
        <div className="text-2xl font-bold">{title}</div>
        <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
      </div>

      {!isRelatedProjects &&
        (showCreateButton ? (
          <div className="w-48 mt-4">
            <Button
              onClick={() => router.push("/create-project")}
              variant={"outline"}
              size={"lg"}
              className="w-48 mt-4"
            >
              Create one now
            </Button>
          </div>
        ) : (
          <div className="w-48 mt-4">
            <Button
              onClick={() => router.push("/")}
              variant={"outline"}
              size={"lg"}
              className="w-48 mt-4"
            >
              Back to home
            </Button>
          </div>
        ))}
    </div>
  );
};

export default EmptyState;
