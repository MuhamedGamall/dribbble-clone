"use client";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Categories from "./Categories";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SearchBar({ q }: { q?: string | null | undefined }) {
  const router = useRouter();
  const [query, setQuery] = useState(q || "");
  const pathname = usePathname();
  useEffect(() => {
    setQuery(q || "");
  }, [q]);
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query?.trim()) return router.push(pathname);
    router.push(`${pathname}/?q=${query?.trim()}`);
    router.refresh();
  };
  return (
    <div className="w-full relative">
      <div className="background-bar sm:hidden " />
      <div className="flex items-center max-sm:hidden justify-center w-full bg-[#fe507f] relative">
        <Image
          alt="cover search"
          width={400}
          height={236}
          priority={true}
          src="/search-header-620-e087a00b80a13bfbc4705b2eb9e6d3de0bd542009eb93f5a7e7ee5774e978c63.webp"
          className="w-fit "
        />
        <div className=" text-white flex flex-col items-center justify-center gap-3 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
          <div className=" font-bold text-center text-[30px] md:text-[40px]">
            Search Flexibble
          </div>
          <p className="text-[15px] md:text-[20px] break-all font-semibold text-center">
            24,700,000+ images from thousands of inspirational designers
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => handleSearch(e)}
        className="absolute  left-[50%] rounded-2xl overflow-hidden  shadow-searchBar bottom-[165px] -translate-x-[50%]  max-w-[628px] w-[90%]  h-[64px] "
      >
        <Input
          type="text"
          name="search"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="Search By title, category or user"
          className="[&]:placeholder:text-slate-400  relative pl-5 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 h-full w-full"
        />
        <button className="absolute right-5 top-1/2 -translate-y-1/2">
          <Search size={25} className="text-slate-300 " />
        </button>
      </form>
      <div className="mt-[70px] " />

      <div className=" flex item-center gap-2 mt-20 mx-auto w-fit">
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className={cn(
            "shadow-searchBar  px-5 md:px-8  rounded-md text-slate-600  transition-all",
            {
              "text-slate-800 bg-light-white-300 font-medium":
                !["/favorites", "/following"].includes(pathname) &&
                pathname.includes("/"),
            }
          )}
        >
          Explore
        </Button>
        <Button
          onClick={() => router.push("/following")}
          variant="ghost"
          className={cn(
            "shadow-searchBar px-5 md:px-8   text-slate-600 transition-all",
            {
              "text-slate-800 bg-light-white-300 font-medium":
                pathname.includes("/following"),
            }
          )}
        >
          Following
        </Button>
      </div>
      <Categories />
    </div>
  );
}
