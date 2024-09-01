import LoaderWrapper from "@/components/LoaderWrapper";
import ProjectsContent from "@/components/ProjectsContent";
import SearchBar from "@/components/SearchBar";
import { fetchProjects } from "@/lib/actions";

const FollowingPage = async ({
  searchParams: { q },
}: {
  searchParams: { q: string };
}) => {
  const { projects, isLoading } = await fetchProjects({
    followingOnly: true,
    searchQuery: q,
  });

  return (
    <>
      <SearchBar q={q}/>
      <ProjectsContent data={projects} loading={isLoading} />
    </>
  );
};

export default FollowingPage;
