"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteProject } from "@/lib/actions";
import { Heart } from "lucide-react";

type Props = {
  projectId: string;
  isCreator: boolean;
};

const ProjectActions = ({ projectId, isCreator }: Props) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

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

  return (
    <>
      <button
        type="button"
        // disabled={isDeleting}
        className={`flexCenter favorite-action_btn `}
        // onClick={handleDeleteProject}
      >
        <Heart size={15} className="text-slate-200" />
      </button>
      {isCreator && (
        <>
          <Link
            href={`/update-project/${projectId}`}
            className="flexCenter edit-action_btn"
          >
            <Image src="/pencile.svg" width={15} height={15} alt="edit" />
          </Link>

          <button
            type="button"
            disabled={isDeleting}
            className={`flexCenter delete-action_btn ${
              isDeleting ? "bg-gray" : "bg-primary-purple"
            }`}
            onClick={handleDeleteProject}
          >
            <Image src="/trash.svg" width={15} height={15} alt="delete" />
          </button>
        </>
      )}
    </>
  );
};

export default ProjectActions;
