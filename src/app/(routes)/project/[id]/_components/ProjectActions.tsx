"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  addProjectViewCount,
  deleteProject,
  toggleFavorite,
} from "@/lib/actions";
import { cn } from "@/lib/utils";
import { HeartIcon, Loader2 } from "lucide-react";

type Props = {
  projectId: string;
  isCreator: boolean;
  isFavorite: boolean;
};

const ProjectActions = ({ projectId, isFavorite, isCreator }: Props) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOptimisticFavorite, setOptimisticFavorite] = useState(isFavorite);
  const [disabledFavBtn, setDisabledFavBtn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (projectId) {
      const handleViewsCount = async () => {
        await addProjectViewCount(projectId, pathname);
      };
      handleViewsCount();
    }
  }, [projectId]);

  const handleDeleteProject = async () => {
    if (!isCreator) return;

    setIsDeleting(true);

    try {
      await deleteProject(projectId).then(() => {
        router.replace("/");
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
      setOptimisticFavorite(!isOptimisticFavorite);
      setDisabledFavBtn(true);
      await toggleFavorite(projectId, pathname);
      setDisabledFavBtn(false);
    } catch (error) {
      console.error(error);
      setOptimisticFavorite(isOptimisticFavorite);
    }
  };
  return (
    <>
      <button
        disabled={disabledFavBtn}
        onClick={toggleFav}
        type="button"
        className={cn(`flexCenter  favorite-action_btn  `, {
          "bg-slate-500 ": disabledFavBtn,
        })}
      >
        {disabledFavBtn && (
          <Loader2 size={15} className="animate-spin text-slate-700" />
        )}
        {!disabledFavBtn &&
          (isOptimisticFavorite ? (
            <HeartIcon size={15} fill="#ff474791" className="text-red-500" />
          ) : (
            <HeartIcon size={15} className="text-slate-700" />
          ))}
      </button>
      {isCreator && (
        <>
          <Link
            href={`/update-project/${projectId}`}
            className="flexCenter edit-action_btn"
          >
            <Image
              loading="lazy"
              src="/pencile.svg"
              width={15}
              height={15}
              alt="edit"
            />
          </Link>

          <button
            type="button"
            disabled={isDeleting}
            className={`flexCenter delete-action_btn ${
              isDeleting ? "bg-slate-500" : "bg-primary-purple"
            }`}
            onClick={handleDeleteProject}
          >
            {isDeleting && (
              <Loader2 size={15} className="animate-spin text-slate-700" />
            )}
            {!isDeleting && (
              <Image
                loading="lazy"
                src="/trash.svg"
                width={15}
                height={15}
                alt="delete"
              />
            )}
          </button>
        </>
      )}
    </>
  );
};

export default ProjectActions;
