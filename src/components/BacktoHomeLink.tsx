import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function BacktoHomeLink() {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-3 mb-7 mt-5 text-[13px] text-slate-700"
    >
      <MoveLeft size={17} />
      Back to home
    </Link>
  );
}
