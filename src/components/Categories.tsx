"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { categoryFilters } from "@/constant";
import Container from "./Container";

const Categories = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoryParam = searchParams.get("q");

  const handleTags = (item: string) => {
    if (item === categoryParam) {
      if(["/favorites", "/following"].includes(pathname)){ 
        router.push(pathname)
      }else router.push("/");
    } else {
    

        if(["/favorites", "/following"].includes(pathname)){ 
        router.push(`${pathname}/?q=${item}`)
      }else router.push(`/?q=${item}`)
    }
    router.refresh();
  };

  return (
    <Container className=" gap-5 flex justify-center mb-2  shadow-menu px-5 py-2  rounded-2xl mx-7">
      <ul className="flex gap-2 overflow-x-auto py-3">
        {categoryFilters.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleTags(category)}
            className={`${
              categoryParam === category
                ? "bg-light-white-300 font-medium"
                : "font-normal"
            }  outline-none px-3 py-2 rounded-[30px] text-slate-700 capitalize whitespace-nowrap sm:text-[14px] text-[12px] font-semibold`}
          >
            {category}
          </button>
        ))}
      </ul>
    </Container>
  );
};

export default Categories;
