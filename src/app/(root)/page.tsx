import EmptyState from "@/components/EmptyState";
import ProjectCard from "@/components/ProjectCard";
import { fetchProjects } from "@/lib/actions";
import { ProjectInterface } from "@/types";

type SearchParams = {
  category?: string | null;
  endcursor?: string | null;
};

type Props = {
  searchParams: SearchParams;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams: { category } }: Props) => {
  const data = await fetchProjects({});

  if (data?.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        {/* <Categories /> */}
        <EmptyState showCreateButton />
      </section>
    );
  }

  return (
    <section className="flexStart flex-col paddings mb-16 ">
      {/* <Categories /> */}

      <section className="projects-grid  w-full">
        {data?.map((project: ProjectInterface) => (
          <ProjectCard
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

      {/* <LoadMore 
        startCursor={data?.projectSearch?.pageInfo?.startCursor} 
        endCursor={data?.projectSearch?.pageInfo?.endCursor} 
        hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage} 
        hasNextPage={data?.projectSearch?.pageInfo.hasNextPage}
      /> */}
    </section>
  );
};

export default Home;
