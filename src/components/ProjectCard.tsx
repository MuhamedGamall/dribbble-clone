"use client";

import { toggleFavorite } from "@/lib/actions";
import { cn, formatNumber } from "@/lib/utils";
import { ProjectInterface } from "@/types";
import { Eye, Heart, HeartIcon, Loader, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
interface Props extends ProjectInterface {
  isProjectPage?: boolean;
  name: string;
  avatarUrl: string;
  userId: string;
  isFavorite: boolean;
  loading?: boolean;
}

const ProjectCard = ({
  _id,
  posterUrl,
  title,
  name,
  viewership,
  likesCount,
  isFavorite,
  avatarUrl,
  userId,
  loading = false,
  isProjectPage,
}: Props) => {
  const [disabledFavBtn, setDisabledFavBtn] = useState(false);
  const pathname = usePathname();

  const toggleFav = async () => {
    try {
      setDisabledFavBtn(true);
      await toggleFavorite(_id, pathname);
      setTimeout(() => {
        setDisabledFavBtn(false);
      }, 500);
    } catch (error) {
      console.error(error);
      setDisabledFavBtn(false);
    }
  };

  return (
    <div className="flexCenter flex-col rounded-2xl  ">
      <div className="flexCenter group relative">
        <Link href={`/project/${_id}`} className="rounded-2xl bg-slate-200">
          <Image
            loading="lazy"
            src={posterUrl}
            width={414}
            height={314}
            className="w-full aspect-[5/4.5]  h-full object-cover rounded-2xl"
            alt="project image"
          />
        </Link>

        <div className="hidden group-hover:flex profile_card-title items-center justify-between ">
          <p className="w-full truncate ">{title}</p>
          <button
            disabled={disabledFavBtn}
            onClick={toggleFav}
            type="button"
            className={cn(
              `flexCenter  favorite-action_btn bg-white !rounded-full `,
              { "bg-slate-500 ": disabledFavBtn }
            )}
          >
            {disabledFavBtn && (
              <Loader2 size={15} className="animate-spin text-slate-700" />
            )}
            {!disabledFavBtn &&
              (isFavorite || isFavorite ? (
                <HeartIcon
                  size={15}
                  fill="#ff474791"
                  className="text-red-500"
                />
              ) : (
                <HeartIcon size={15} className="text-slate-700" />
              ))}
          </button>
        </div>
      </div>

      {!isProjectPage && (
        <div className="flexBetween w-full px-2 mt-3 font-semibold text-sm">
          <Link href={`/profile/${userId}`}>
            <div className="flexCenter gap-2">
              <Image
                loading="lazy"
                src={avatarUrl}
                width={24}
                height={24}
                className="rounded-full"
                alt="profile image"
              />
              <p className="text-[10px] truncate">{name}</p>
            </div>
          </Link>

          <div className="flexCenter gap-3">
            <div className="flexCenter gap-1">
              <Eye size={13}  className="text-[#9e9ea7]" />
              <p className="text-[10px] text-[#9e9ea7] font-semibold">
                {formatNumber(likesCount)}
              </p>
            </div>
            <div className="flexCenter gap-1">
              <HeartIcon size={13} fill="#9e9ea7" className="text-[#9e9ea7]" />
              <p className="text-[10px] text-[#9e9ea7] font-semibold">
                {formatNumber(viewership)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
ProjectCard.Skeleton = () => {
  return (
    <div className="p-4 shadow-sm  rounded-2xl  ">
      <div className="  h-48 bg-slate-200 rounded-2xl"></div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-[100px] h-4 rounded-lg" />
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
export default ProjectCard;
