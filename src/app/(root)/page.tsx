import ProjectsContent from "@/components/ProjectsContent";
import SearchBar from "@/components/SearchBar";
import { fetchProjects } from "@/lib/actions";

// export const dynamic = "force-dynamic";
// export const dynamicParams = true;
// export const revalidate = 0;

const Home = async ({
  searchParams: { q },
}: {
  searchParams: { q: string };
}) => {
  const { projects, isLoading } = await fetchProjects({ searchQuery: q });
  return (
    <>
      <SearchBar />
      <ProjectsContent loading={isLoading} data={projects} />
    </>
  );
};

export default Home;
