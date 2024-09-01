"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "../../../../../lib/utils";
import ToggleFollowButton from "./ToggleFollowButton";

export default function FollowingModal({
  followingData,
}: {
  followingData: UserProfile[];
}) {
  return (
    <div className="fixed bottom-6 right-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex p-5 items-center justify-center rounded-full  text-primary-foreground shadow-lg transition-all hover:scale-105 "
          >
            <Menu size={20} className="text-slate-800" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          className={cn(
            "xxs:w-[300px]   overflow-x-hidden w-screen max-h-[500px] overflow-y-auto   p-3 rounded-2xl shadow-lg mb-5 bg-card  border-0 ",
            { "!h-[200px]": followingData?.length == 0 }
          )}
        >
          {
            <div className="p-3 flex items-center font-bold gap-2 border-b mb-5">
              Following
              <div className="text-sm font-normal text-slate-500">
                ( {formatNumber(followingData?.length)} )
              </div>
            </div>
          }
          
          
          <div className="flex flex-col  gap-2  focus:outline-none rounded-md">
            {followingData?.length > 0 ? (
              followingData?.map((el) => (
                <div className="flex items-center bordeer-b gap-2 rounded-md  transition-colors hover:bg-accent hover:text-accent-foreground">
                  <DropdownMenuItem className="flex flex-[3] cursor-pointer items-center gap-2 rounded-md p-1 pr-3 text-sm font-medium ">
                    <Link
                      href={`/profile/${el?._id}`}
                      className="flex items-center gap-2 p-2"
                    >
                      {el?.avatarUrl ? (
                        <Image
                          loading="lazy"
                          src={el?.avatarUrl}
                          width={40}
                          height={40}
                          className="rounded-full"
                          alt="user profile image"
                        />
                      ) : (
                        <User size={40} />
                      )}
                      <div className="font-semibold capitalize">{el?.name}</div>
                    </Link>
                  </DropdownMenuItem>
                  <ToggleFollowButton userId={el?._id}>
                    <button className="flex-1 text-slate-600 text-[13px] flex items-center justify-center pr-3">
                      Unfollow
                    </button>
                  </ToggleFollowButton>
                </div>
              ))
            ) : (
              <span className="my-10 text-center w-full text-slate-600 font-semibold">
                No Following yet
              </span>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
