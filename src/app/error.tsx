"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <div className="h-screen  flex flex-col justify-center items-center space-y-4">
      <h2 className="text-xl font-medium">Something went wrong!</h2>
      <Button asChild variant={"outline"} size={"lg"}>
        <Link href="/" >Go back</Link>
      </Button>
    </div>
  );
}
