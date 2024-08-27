"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({ children }: any) {
  return <SessionProvider>{children}</SessionProvider>;
}
