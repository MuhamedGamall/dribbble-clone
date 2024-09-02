"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { User } from "lucide-react";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { useState } from "react";

const ProfileMenu = ({ session }: { session: Session | any }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild className="">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:shadow-md  p-1 w-[60px] h-[60px] "
        >
          {session?.image ? (
            <Image
              loading="lazy"
              src={session?.image}
              width={40}
              height={40}
              className="rounded-full"
              alt="user profile image"
            />
          ) : (
            <User size={30} className="" />
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {session && (
          <Link
            href={`/profile/${session?._id}`}
            className="flex items-center gap-2 p-2"
          >
            {session?.image ? (
              <Image
                loading="lazy"
                src={session?.image}
                width={40}
                height={40}
                className="rounded-full"
                alt="user profile image"
              />
            ) : (
              <User size={40} />
            )}
            <div className="grid gap-0.5 leading-none">
              <div className="font-semibold capitalize">{session?.name}</div>
              <div className="text-sm text-muted-foreground ">
                {session?.email}
              </div>
            </div>
          </Link>
        )}
        {session ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpen(false)} asChild>
              <Link
                href={`/profile/${session?._id}`}
                className="flex items-center gap-2"
              >
                <div className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(false)} asChild>
              <Link href={`/favorites/`} className="flex items-center gap-2">
                <div className="h-4 w-4" />
                <span>favorites</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              asChild
              className="p-3"
            >
              <span>Log Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={async () => {
              setOpen(false);
              await signIn("google", { callbackUrl: "/" });
            }}
            asChild
            className="p-3"
          >
            <span className="flex items-center gap-2">
              <Image
                src={
                  "https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                }
                width={30}
                height={30}
                priority={true}
                alt="google icon"
              />
              Log In with Google
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
