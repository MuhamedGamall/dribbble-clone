import Link from "next/link";

import { getUserProjects } from "@/lib/actions";
import { ProjectInterface, UserProfile } from "@/types";
import Image from "next/image";
import ProjectsContent from "./ProjectsContent";
import EmptyState from "./EmptyState";

type Props = {
  userId: string;
  projectIdForIgnore: string;
  projectsIds?: string[];
};

const RelatedProjects = async ({
  userId,
  projectIdForIgnore,
  projectsIds,
}: Props) => {
  const { projects, isLoading } = await getUserProjects({
    userId,
    projectIdForIgnore,
    projectsIds,
  });
  if (projects?.length ===0) {
    return (
      <section className="flexStart flex-col paddings ">
        <EmptyState
          showCreateButton
          isRelatedProjects
          title="There are no related projects"
          subtitle=" "
          className="!h-20 "
        />
      </section>
    );
  }
  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">
          More by{' '}
          <Link
            href={`/profile/${projects?.[0]?.creator?._id}`}
            className="text-primary-purple capitalize"
          >
            {projects?.[0]?.creator?.name}
          </Link>
        </p>
        <Link
          href={`/profile/${projects?.[0]?.creator?._id}`}
          className="text-primary-purple text-base"
        >
          View All
        </Link>
      </div>

      <ProjectsContent data={projects} isProjectPage />
    </section>
  );
};

export default RelatedProjects;
