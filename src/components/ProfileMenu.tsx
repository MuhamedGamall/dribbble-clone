"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { Session } from "next-auth";

const ProfileMenu = ({ session }: { session: Session | any }) => {
  return (
    <div className="flexCenter z-10 flex-col relative ">
      <DropdownMenu>
        <DropdownMenuTrigger>
          {session?.image && (
            <Image
              src={session?.image}
              width={40}
              height={40}
              className="rounded-full"
              alt="user profile image"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="">
            <Link
              href={`/profile/${session?._id}`}
              className="flex flex-col items-center gap-y-2 p-5"
            >
              {session?.image && (
                <Image
                  src={session?.image}
                  className="rounded-full"
                  width={80}
                  height={80}
                  alt="profile Image"
                />
              )}
              <p className="font-semibold md:text-2xl capitalize">
                {session?.name}
              </p>
            </Link>
            <DropdownMenuItem asChild>
              <Link
                href={"/favorites"}
                type="button"
                className="text-sm  w-full pt-3 p-2"
              >
                Favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="text-sm font-bold text-primary/50 w-full pt-3 p-2"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileMenu;
