import Container from "@/components/Container";
import ProjectsContent from "@/components/ProjectsContent";
import { Button } from "@/components/ui/button";
import {
  getCurrentSession,
  getFollowing,
  getUserProjects,
} from "@/lib/actions";
import { cn, formatNumber } from "@/lib/utils";
import { Linkedin, LucideLink2, Plus, PlusSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FollowingModal from "./_components/FollowingModal";
import ToggleFollowButton from "./_components/ToggleFollowButton";
import { UpdateProfileModel } from "./_components/UpdateProfile";
import { TooltipHover } from "./_components/TooltibHover";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  const {isLoading,projects,user} = await getUserProjects({ userId: params?.id });
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
                  "items-center text-center": projects?.length === 0,
                }
              )}
            >
              <div className="flex gap-5 items-end">
                <Image
                  loading="lazy"
                  src={user?.avatarUrl}
                  width={100}
                  height={100}
                  className="rounded-full "
                  alt="user image"
                />
                <span className="rounded-md font-semibold  bg-slate-100 px-3 py-1">
                  Followers ({formatNumber(user?.followersCount)})
                </span>
              </div>
              <div className="flex items-center gap-3 mt-5 ">
                <span className="text-4xl block font-bold max-w-lg  capitalize">
                  {user?.name}
                </span>

                {session?.user?._id !== params?.id && (
                  <>
                    <Image
                      loading="lazy"
                      src="/dot.svg"
                      width={5}
                      height={5}
                      alt="dot"
                    />
                    <ToggleFollowButton userId={params?.id}>
                      {session?.user?.following?.includes(params?.id) ? (
                        <button className="text-red-500">Unfollow</button>
                      ) : (
                        <button className="text-green-600">Follow</button>
                      )}
                    </ToggleFollowButton>
                  </>
                )}
              </div>
              {(user?.githubUrl ||
                user?.linkedinUrl ||
                user?.websiteUrl) && (
                <ul className="flex items-center gap-3 mt-5 flex-wrap [&>li]:shadow-sm">
                  {user?.githubUrl && (
                    <li>
                      <TooltipHover label="Gethub Link">
                        <Link href={user?.githubUrl} target="_blank">
                          <svg
                            className="border rounded-sm p-1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                          >
                            <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
                          </svg>
                        </Link>
                      </TooltipHover>
                    </li>
                  )}
                  {user?.linkedinUrl && (
                    <li>
                      <TooltipHover label="LinkedIn Link">
                        <Link href={user?.linkedinUrl} target="_blank">
                          <Linkedin
                            size={30}
                            className=" border rounded-sm p-1"
                          />
                        </Link>
                      </TooltipHover>
                    </li>
                  )}
                  {user?.websiteUrl && (
                    <li>
                      <TooltipHover label="Website Link">
                        <Link href={user?.websiteUrl} target="_blank">
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
                {user?.description ||
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
                    <Link href={`mailto:${user?.email}`}>
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

            {user?.projects?.length > 0 && (
              <Image
                loading="lazy"
                src={projects?.[0]?.posterUrl}
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

            <ProjectsContent data={projects} loading={isLoading} />
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
