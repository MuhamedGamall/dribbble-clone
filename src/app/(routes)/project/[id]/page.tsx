import Image from "next/image";
import Link from "next/link";

import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import BacktoHomeLink from "@/components/BacktoHomeLink";
import Categories from "@/components/Categories";
import LoaderWrapper from "@/components/LoaderWrapper";
import RelatedProjects from "@/components/RelatedProjects";
import { getCurrentSession, getProject } from "@/lib/actions";
import ProjectActions from "./_components/ProjectActions";
import ToggleFollowButton from "../../profile/[id]/_components/ToggleFollowButton";

const Project = async ({ params: { id } }: { params: { id: string } }) => {
  const { project, isLoading } = await getProject(id, "/project/" + id);

  const { session } = await getCurrentSession();

  if (!project) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <EmptyState
          title="Failed to fetch project info"
          subtitle="No project found"
          link="/"
          showButton
          buttonTitle="Back to home"
        />
      </section>
    );
  }

  const renderLink = () => `/profile/${project?.creator?._id}`;
  const isCreator =
    session?.user?.email === project?.creator?.email &&
    session?.user?._id.toString() === project?.creator?._id.toString();
  return (
    <LoaderWrapper isLoading={isLoading}>
      <Container>
        <Categories />
        <div className={"lg:px-40 px-8 pt-14 pb-72"}>
          <BacktoHomeLink />
          <section className="flexBetween gap-y-8 max-xs:flex-col w-full">
            <div className="flex-1 flex items-start gap-5 w-full  max-xs:flex-col">
              <Link href={renderLink()}>
                <Image
                  loading="lazy"
                  src={project?.creator?.avatarUrl}
                  width={50}
                  height={50}
                  alt="profile"
                  className="rounded-full"
                />
              </Link>

              <div className="flex-1 flexStart flex-col gap-1">
                <p className="self-start text-lg capitalize font-semibold">
                  {project?.title}
                </p>
                <div className="flex  w-full gap-2 flex-col">
                  <div className="user-info">
                    <Link href={renderLink()}  className="capitalize">
                      {project?.creator?.name}
                    </Link>
                    {session?.user?._id !== project?.creator?._id && (
                      <>
                        <Image
                          loading="lazy"
                          src="/dot.svg"
                          width={4}
                          height={4}
                          alt="dot"
                        
                        />
                        <ToggleFollowButton userId={project?.creator?._id}>
                          {session?.user?.following?.includes(
                            project?.creator?._id
                          ) ? (
                            <button className="text-red-500">Unfollow</button>
                          ) : (
                            <button className=" text-green-600">Follow</button>
                          )}
                        </ToggleFollowButton>
                      </>
                    )}
                  </div>
                  <Link
                    href={`/?q=${project?.category}`}
                    className="text-primary-purple font-semibold"
                  >
                    {project?.category}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-end max-xs:w-full items-center gap-2">
              <ProjectActions
                projectId={project?._id}
                isFavorite={project?.isFavorite}
                isCreator={isCreator}
              />
            </div>
          </section>

          <section className="mt-14 mx-auto w-fit">
            <Link href={project?.posterUrl} target="_blank" rel="noreferrer">
              <Image
                loading="lazy"
                src={`${project?.posterUrl}`}
                className="object-cover rounded-2xl"
                width={1064}
                height={798}
                alt="poster"
              />
            </Link>
          </section>

          <section className="flexCenter flex-col mt-20">
            <p className="text-xl font-normal max-w-[900px] break-all text-justify">
              {project?.description}
            </p>

            <div className="flex flex-wrap mt-5 gap-5">
              {project?.githubUrl && (
                <Link
                  href={project?.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flexCenter gap-2 tex-sm font-medium text-primary-purple"
                >
                  <Image
                    loading="lazy"
                    alt="github"
                    src={
                      "https://img.icons8.com/?size=100&id=16318&format=png&color=000000"
                    }
                    height={25}
                    width={25}
                  />
                  <span className="underline">Github</span>
                </Link>
              )}

              {project?.projectUrl && project?.githubUrl && (
                <Image
                  loading="lazy"
                  src="/dot.svg"
                  width={4}
                  height={4}
                  alt="dot"
                />
              )}
              {project?.projectUrl && (
                <Link
                  href={project?.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flexCenter gap-2 tex-sm font-medium text-primary-purple"
                >
                  🚀 <span className="underline">Project Site</span>
                </Link>
              )}
            </div>
          </section>

          <section className="flexCenter w-full gap-8 mt-28">
            <span className="w-full h-0.5 bg-light-white-200" />
            <Link href={renderLink()} className="min-w-[82px] h-[82px]">
              <Image
                loading="lazy"
                src={project?.creator?.avatarUrl}
                className="rounded-full"
                width={82}
                height={82}
                alt="profile image"
              />
            </Link>
            <span className="w-full h-0.5 bg-light-white-200" />
          </section>

          <RelatedProjects
            userId={project?.creator?._id}
            projectIdForIgnore={project?._id}
          />
        </div>
      </Container>
    </LoaderWrapper>
  );
};

export default Project;
