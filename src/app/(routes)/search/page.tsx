import Categories from "@/components/Categories";
import EmptyState from "@/components/EmptyState";
import ProjectsContent from "@/components/ProjectsContent";
import LoaderProvider from "@/components/providers/LoaderProvider";
import SearchBar from "@/components/SearchBar";
import { fetchProjects } from "@/lib/actions";
import React from "react";

export default async function SearchPage({
  searchParams: { q },
}: {
  searchParams: { q: string };
}) {
  const { projects, isLoading } = await fetchProjects({ searchQuery: q });
  return (
    <>
      <LoaderProvider isLoading={isLoading}>
        <SearchBar q={q} />
        <ProjectsContent data={projects} />
      </LoaderProvider>
    </>
  );
}
