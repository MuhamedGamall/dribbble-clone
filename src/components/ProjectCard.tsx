"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { deleteProject, toggleFavorite } from "@/lib/actions";
import { cn, formatNumber } from "@/lib/utils";
import { ProjectInterface } from "@/types";
import { Edit, Eye, HeartIcon, Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface Props extends ProjectInterface {
  isProjectPage?: boolean;
  name: string;
  avatarUrl: string;
  userId: string;
  isFavorite: boolean;
  loading?: boolean;
  userEmail: string;
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
  userEmail,
  loading = false,
  isProjectPage,
}: Props) => {
  const [disabledFavBtn, setDisabledFavBtn] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const session = useSession() as any;
  const router = useRouter();
  const pathname = usePathname();
  const isCreator =
    session?.data?.user?.email === userEmail &&
    session?.data?.user?._id.toString() === userId.toString();
  const handleDeleteProject = async () => {
    if (!isCreator) return;

    setIsDeleting(true);

    try {
      await deleteProject(_id).then(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
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
  const [randomLikes, setRandomLikes] = useState(0);

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
        {isCreator && pathname.includes("/profile") && (
          <div className="absolute top-5 right-5 items-center gap-2 group-hover:flex hidden transition-all">
            <Link
              href={`/update-project/${_id}`}
              className="flexCenter edit-action_btn  !bg-slate-100/40 !p-2"
            >
              <Edit size={15} className="text-slate-900 " />
            </Link>

            <button
              type="button"
              disabled={isDeleting}
              className={`flexCenter delete-action_btn !bg-red-300/40 !p-2`}
              onClick={handleDeleteProject}
            >
              {isDeleting && (
                <Loader2 size={15} className="animate-spin text-slate-700" />
              )}
              {!isDeleting && <Trash2 size={15} className="text-slate-900 " />}
            </button>
          </div>
        )}
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
              <HeartIcon size={13} fill="#9e9ea7" className="text-[#9e9ea7]" />
              <p className="text-[10px] text-[#9e9ea7] font-semibold">
                {formatNumber(likesCount)}
              </p>
            </div>
            <div className="flexCenter gap-1">
              <Eye size={13} className="text-[#9e9ea7]" />
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
