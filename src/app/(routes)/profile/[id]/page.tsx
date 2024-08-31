import Container from "@/components/Container";
import ProjectsContent from "@/components/ProjectsContent";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getCurrentSession,
  getFollowing,
  getUserProjects,
  toggleFollow,
} from "@/lib/actions";
import { cn, formatNumber } from "@/lib/utils";
import {
  Github,
  Linkedin,
  LucideLink2,
  Plus,
  PlusSquareIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FollowingModal from "./_components/FollowingModal";
import { UpdateProfileModel } from "./_components/UpdateProfile";
import { toast } from "sonner";
import ToggleFollowButton from "./_components/ToggleFollowButton";

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
  const result = await getUserProjects({ userId: params?.id });
  const { session } = await getCurrentSession();
  const { followingData, loading } = await getFollowing();

  return (
    <>
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
              <div className="flex gap-5 items-end">
                <Image
                  loading="lazy"
                  src={result?.user?.avatarUrl}
                  width={100}
                  height={100}
                  className="rounded-full "
                  alt="user image"
                />
                <span className="rounded-md font-semibold  bg-slate-100 px-3 py-1">
                  Followers ({formatNumber(result?.user?.followersCount)})
                </span>
              </div>
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
                {session && session?.user?._id === params?.id && (
                  <UpdateProfileModel session={session} />
                )}
                {session && session?.user?._id === params?.id && (
                  <Link href={`/create-project`}>
                    <Button
                      variant={"outline"}
                      className=" gap-1 items-center "
                    >
                      <PlusSquareIcon size={15} />
                      Create a Project
                    </Button>
                  </Link>
                )}

                {session?.user?._id !== params?.id && (
                  <>
                    <ToggleFollowButton userId={params?.id}>
                      <Button className="gap-1 items-center hover:bg-slate-200   bg-light-white-400 !w-max text-black-100">
                        {session?.user?.following?.includes(params?.id) ? (
                          "Unfollow"
                        ) : (
                          <>
                            <Plus size={15} />
                            Follow
                          </>
                        )}
                      </Button>
                    </ToggleFollowButton>
                    <Link href={`mailto:${result?.user?.email}`}>
                      <Button className="bg-primary-purple gap-1 items-center hover:opacity-[0.7]">
                        <Image
                          loading="lazy"
                          src={"/email.svg"}
                          alt="mail"
                          width={20}
                          height={20}
                        />
                        Hire me
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {result?.user?.projects?.length > 0 && (
              <Image
                loading="lazy"
                src={result?.projects?.[0]?.posterUrl}
                alt="project image"
                width={739}
                height={554}
                className="rounded-xl shadow-md w-[50%] object-contain md:block hidden"
              />
            )}
          </section>

          <section className="flexStart flex-col lg:mt-28 mt-16 w-full">
            <p className="w-full text-left text-lg font-semibold">
              Recent Work
            </p>

            <ProjectsContent data={result?.projects} />
          </section>
        </section>
      </Container>
      {session?.user?._id === params?.id && (
        <FollowingModal followingData={followingData} />
      )}
    </>
  );
};

export default UserProfile;
