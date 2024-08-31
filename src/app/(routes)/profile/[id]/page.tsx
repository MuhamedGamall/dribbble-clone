import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { getCurrentSession, getUserProjects } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { ProjectInterface } from "@/types";
import {
  Github,
  Linkedin,
  LucideLink2,
  Plus,
  PlusSquareIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UpdateProfileModel } from "./_components/UpdateProfile";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Container from "@/components/Container";
import ProjectsContent from "@/components/ProjectsContent";

type Props = {
  params: {
    id: string;
  };
};

export function TooltipHover({
  children,
  label,
}: {
  label: string;
  children: any;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const UserProfile = async ({ params }: Props) => {
  const result = await getUserProjects({ userId: params.id });
  const {session} = await getCurrentSession();
  return (
    <Container>
      <section className="flexCenter flex-col  w-full mx-auto paddings">
        <section className="flexBetween max-md:flex-col gap-10 w-full">
          <div
            className={cn(
              "flex  items-start flex-col w-full max-md:items-center max-md:text-center",
              {
                "items-center text-center": result?.projects?.length === 0,
              }
            )}
          >
            <Image
              src={result?.user?.avatarUrl}
              width={100}
              height={100}
              className="rounded-full "
              alt="user image"
            />
            <p className="text-4xl font-bold mt-5 max-w-lg  capitalize">
              {result?.user?.name}
            </p>
            {(result?.user?.githubUrl ||
              result?.user?.linkedinUrl ||
              result?.user?.websiteUrl) && (
              <ul className="flex items-center gap-3 mt-5 flex-wrap [&>li]:shadow-sm">
                {result?.user?.githubUrl && (
                  <li>
                    <TooltipHover label="Gethub Link">
                      <Link href={result?.user?.githubUrl} target="_blank">
                        <Github size={30} className="border rounded-sm p-1" />
                      </Link>
                    </TooltipHover>
                  </li>
                )}
                {result?.user?.linkedinUrl && (
                  <li>
                    <TooltipHover label="LinkedIn Link">
                      <Link href={result?.user?.linkedinUrl} target="_blank">
                        <Linkedin
                          size={30}
                          className=" border rounded-sm p-1"
                        />
                      </Link>
                    </TooltipHover>
                  </li>
                )}
                {result?.user?.websiteUrl && (
                  <li>
                    <TooltipHover label="Website Link">
                      <Link href={result?.user?.websiteUrl} target="_blank">
                        <LucideLink2
                          size={30}
                          className="border rounded-sm p-1"
                        />
                      </Link>
                    </TooltipHover>
                  </li>
                )}
              </ul>
            )}
            <p className="md:text-5xl text-3xl  font-extrabold md:mt-10 mt-5 max-w-lg">
              {result?.user?.description ||
                "I’m Software Engineer at Microsoft 👋"}
            </p>

            <div className="flex mt-8 gap-5 w-fit max-md:justify-center flex-wrap">
              {session && <UpdateProfileModel session={session} />}
              {session && (
                <Link href={`/create-project`}>
                  <Button variant={"outline"} className=" gap-1 items-center ">
                    <PlusSquareIcon size={15} />
                    Create a Project
                  </Button>
                </Link>
              )}

              {session?.user?._id !== params?.id && (
                <Button className="gap-1 items-center hover:bg-slate-200   bg-light-white-400 !w-max text-black-100">
                  <Plus size={15} />
                  Follow
                </Button>
              )}
              <Link href={`mailto:${result?.user?.email}`}>
                <Button className="bg-primary-purple gap-1 items-center hover:opacity-[0.7]">
                  <Image src={"/email.svg"} alt="mail" width={20} height={20} />{" "}
                  Hire me
                </Button>
              </Link>
            </div>
          </div>

          {result?.user?.projects?.length > 0 && (
            <Image
              src={result?.projects?.[0]?.posterUrl}
              alt="project image"
              width={739}
              height={554}
              className="rounded-xl shadow-md w-[50%] object-contain md:block hidden"
            />
          )}
        </section>

        <section className="flexStart flex-col lg:mt-28 mt-16 w-full">
          <p className="w-full text-left text-lg font-semibold">Recent Work</p>

          <ProjectsContent data={result?.projects} />
        </section>
      </section>
    </Container>
  );
};

export default UserProfile;
