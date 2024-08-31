"use client";
import EmptyState from "@/components/EmptyState";
import ProjectCard from "@/components/ProjectCard";
import { cn } from "@/lib/utils";
import { ProjectInterface } from "@/types";
import { revalidatePath } from "next/cache";
import { usePathname } from "next/navigation";

type Props = {
  data: ProjectInterface[];
  isProjectPage?: boolean;
  loading?: boolean;
};

const ProjectsContent = ({ data, isProjectPage, loading }: Props) => {
  const pathname = usePathname();
  const isFavoritesPage = pathname?.includes("favorites");
  if (data?.length === 0 && !isProjectPage) {
    return (
      <section className="flexStart flex-col paddings">
        <EmptyState
          showButton
          buttonTitle={
            isFavoritesPage ? "Add some favorites now" : "Create a project now"
          }
          link={isFavoritesPage ? "/" : "/create-project"}
        />
      </section>
    );
  }
  return (
    <section className={cn("flexStart flex-col paddings mb-16 w-full")}>
      <section className={cn("projects-grid  w-full")}>
        {!loading
          ? data?.map((project: ProjectInterface) => (
              <ProjectCard
                isProjectPage={isProjectPage}
                key={`${project?._id}`}
                {...project}
                name={project?.creator?.name}
                avatarUrl={project?.creator?.avatarUrl}
                userId={project?.creator?._id}
              />
            ))
          : Array.from({ length: 8 })?.map((_, i) => (
              <ProjectCard.Skeleton key={i} />
            ))}
      </section>
    </section>
  );
};

export default ProjectsContent;
