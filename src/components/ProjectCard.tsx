"use client";

import { toggleFavorite } from "@/lib/actions";
import { cn, formatNumber } from "@/lib/utils";
import { ProjectInterface } from "@/types";
import { Heart, HeartIcon, Loader, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props extends ProjectInterface {
  isProjectPage?: boolean;
  name: string;
  avatarUrl: string;
  userId: string;
  isFavorite: boolean;
}

const ProjectCard = ({
  _id,
  posterUrl,
  title,
  name,
  likesCount,
  isFavorite,
  avatarUrl,
  userId,
  isProjectPage,
}: Props) => {
  const [randomViews, setRandomViews] = useState("");
  const [isOptimisticFavorite, setOptimisticFavorite] = useState(isFavorite);
  const [isOptimisticLikesCount, setOptimisticLikesCount] =
    useState(likesCount);
  const [disabledFavBtn, setDisabledFavBtn] = useState(false);
  const pathname = usePathname();
  const toggleFav = async () => {
    try {
      setOptimisticFavorite(!isOptimisticFavorite);
      setOptimisticLikesCount(isOptimisticFavorite ? likesCount - 1 : likesCount + 1);
      setDisabledFavBtn(true);
      await toggleFavorite(_id, pathname);
      setDisabledFavBtn(false);
    } catch (error) {
      setOptimisticFavorite(isOptimisticFavorite);
    }
  };

  return (
    <div className="flexCenter flex-col rounded-2xl  ">
      <div className="flexCenter group relative">
        <Link href={`/project/${_id}`}>
          <Image
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
              (isOptimisticFavorite ? (
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
            <div className="flexCenter gap-2">
              <Image src="/hearth.svg" width={13} height={12} alt="heart" />
              <p className="text-sm">{formatNumber(isOptimisticLikesCount)}</p>
            </div>
            <div className="flexCenter gap-2">
              <Image src="/eye.svg" width={12} height={9} alt="eye" />
              <p className="text-sm">{randomViews}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
