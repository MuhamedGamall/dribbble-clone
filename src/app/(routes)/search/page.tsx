import Categories from "@/components/Categories";
import EmptyState from "@/components/EmptyState";
import ProjectsContent from "@/components/ProjectsContent";
import SearchBar from "@/components/SearchBar";
import { fetchProjects } from "@/lib/actions";
import React from "react";

export default async function SearchPage({
  searchParams: { q },
}: {
  searchParams: { q: string };
}) {
  const data = await fetchProjects({ searchQuery: q });

 

  return (
    <>
      <SearchBar q={q} />
      <ProjectsContent data={data} />
    </>
  );
}
