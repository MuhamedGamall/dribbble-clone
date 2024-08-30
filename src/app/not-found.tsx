import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col justify-center items-center space-y-4">
      <h2 className="text-xl font-medium">404 | Not Found Page!</h2>
      <Button asChild>
        <Link href="/documents">Go back</Link>
      </Button>
    </div>
  );
}
