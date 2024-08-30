"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Categories from "./Categories";
import { Input } from "./ui/input";

export default function SearchBar({ q }: { q?: string | null | undefined }) {
  const router = useRouter();
  const [query, setQuery] = useState(q || "");
  useEffect(() => {
    setQuery(q || "");
  }, [q]);
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query?.trim()) return router.push(`/`);
    router.push(`/search?q=${query?.trim()}`);
    router.refresh();
  };
  return (
    <div className="w-full relative">
      <div className="background-bar " />
      <form
        onSubmit={(e) => handleSearch(e)}
        className="absolute  left-[50%] rounded-2xl overflow-hidden  shadow-searchBar top-[50px] -translate-x-[50%]  max-w-[628px] w-[90%]  h-[64px] "
      >
        <Input
          type="text"
          name="search"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="Search..."
          className="[&]:placeholder:text-slate-400  relative pl-5 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 h-full w-full"
        />
        <button className="absolute right-5 top-1/2 -translate-y-1/2">
          <Search size={25} className="text-slate-300 " />
        </button>
      </form>
      <div className="mt-[70px]" />
      <Categories />
    </div>
  );
}
