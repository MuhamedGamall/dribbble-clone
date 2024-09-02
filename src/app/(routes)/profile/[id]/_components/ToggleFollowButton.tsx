"use client";

import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ToggleFollowButton({
  children,
  userId,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const handleFollowing = async () => {
    try {
      setLoading(true);
      await toggleFollow(userId, pathname);
    } catch (error) {
      return toast("Something went wrong.", {
        description: "Failed to follow. Please try again later.",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return loading ? (
    <button className="gap-1 flex items-center rounded-full  hover:bg-slate-300/50   bg-light-white-400/50  text-black-100">
      <Loader2 className="w-4 h-4 animate-spin" />
    </button>
  ) : (
    <div onClick={handleFollowing} className=" ">
      {children}
    </div>
  );
}
