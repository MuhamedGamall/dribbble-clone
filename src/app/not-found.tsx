'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-4">
      <h2 className="text-xl font-medium">404 | Not Found Page!</h2>
      <Button asChild variant={"outline"} size={"lg"}>
        <Link href="/" >Go back</Link>
      </Button>
    </div>
  );
}
