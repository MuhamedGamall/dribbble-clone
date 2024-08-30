import EmptyState from "@/components/EmptyState";
import ProjectCard from "@/components/ProjectCard";
import { ProjectInterface } from "@/types";

type Props = {
  data: ProjectInterface[];
  isProjectPage?: boolean;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const ProjectsContent = async ({ data, isProjectPage }: Props) => {
  if (data?.length === 0 && !isProjectPage) {
    return (
      <section className="flexStart flex-col paddings">
        <EmptyState showCreateButton />
      </section>
    );
  }

  return (
    <section className="flexStart flex-col paddings mb-16 w-full">
      <section className="projects-grid  w-full">
        {data?.map((project: ProjectInterface) => (
          <ProjectCard
            isProjectPage={isProjectPage}
            key={`${project?._id}`}
            id={project?._id}
            posterUrl={project?.posterUrl}
            title={project?.title}
            name={project?.creator?.name}
            avatarUrl={project?.creator?.avatarUrl}
            userId={project?.creator?._id}
          />
        ))}
      </section>
    </section>
  );
};

export default ProjectsContent;
