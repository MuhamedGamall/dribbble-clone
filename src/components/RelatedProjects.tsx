import Link from "next/link";

import { getUserProjects } from "@/lib/actions";
import ProjectsContent from "./ProjectsContent";
import EmptyState from "./EmptyState";

type Props = {
  userId: string;
  projectIdForIgnore: string;
};

const RelatedProjects = async ({
  userId,
  projectIdForIgnore,
}: Props) => {
  const { projects, isLoading } = await getUserProjects({
    userId,
    projectIdForIgnore,
    limit: 6,
  });
  if (projects?.length === 0) {
    return (
      <section className="flexStart flex-col paddings ">
        <EmptyState
          showButton
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
          More by{" "}
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

      <ProjectsContent data={projects} isProjectPage loading={isLoading} />
    </section>
  );
};

export default RelatedProjects;
