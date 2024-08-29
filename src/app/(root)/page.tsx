import Categories from "@/components/Categories";
import EmptyState from "@/components/EmptyState";
import ProjectCard from "@/components/ProjectCard";
import ProjectsContent from "@/components/ProjectsContent";
import SearchBar from "@/components/SearchBar";
import { fetchProjects } from "@/lib/actions";
import { ProjectInterface } from "@/types";

type SearchParams = {
  q?: string | null;
  endcursor?: string | null;
};

type Props = {
  searchParams: SearchParams;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async () => {
  const data = await fetchProjects({});

  if (data?.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <EmptyState showCreateButton />
      </section>
    );
  }

  return (
    <>
      <SearchBar  />
      <ProjectsContent data={data}  />
    </>
  );
};

export default Home;
