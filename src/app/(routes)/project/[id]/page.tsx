import Image from "next/image";
import Link from "next/link";

import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
// import ProjectActions from "@/components/ProjectActions";
// import RelatedProjects from "@/components/RelatedProjects";
import { getCurrentSession, getProject } from "@/lib/actions";
import { Github } from "lucide-react";
import ProjectActions from "./_components/ProjectActions";

const Project = async ({ params: { id } }: { params: { id: string } }) => {
  const data = await getProject(id);

  const session = await getCurrentSession();

  if (!data) {
    return (
      <section className="flexStart flex-col paddings">
        <EmptyState
          title="Failed to fetch project info"
          subtitle="No project found"
        />
      </section>
    );
  }

  const renderLink = () => `/profile/${data?.creator?._id}`;
  const isCreator =
    session?.user?.email === data?.creator?.email &&
    session?.user?._id.toString() === data?.creator?._id.toString();
  return (
    <Container className={"lg:px-40 px-8 pt-14 pb-72"}>
      <section className="flexBetween gap-y-8 max-xs:flex-col w-full">
        <div className="flex-1 flex items-start gap-5 w-full  max-xs:flex-col">
          <Link href={renderLink()}>
            <Image
              src={data?.creator?.avatarUrl}
              width={50}
              height={50}
              alt="profile"
              className="rounded-full"
            />
          </Link>

          <div className="flex-1 flexStart flex-col gap-1">
            <p className="self-start text-lg font-semibold">{data?.title}</p>
            <div className="user-info">
              <Link href={renderLink()}>{data?.creator?.name}</Link>
              <Image src="/dot.svg" width={4} height={4} alt="dot" />
              <Link
                href={`/?category=${data?.category}`}
                className="text-primary-purple font-semibold"
              >
                {data?.category}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-2">
          <ProjectActions projectId={data?._id} isCreator={isCreator} />
        </div>
      </section>

      <section className="mt-14 mx-auto w-fit">
        <Image
          src={`${data?.posterUrl}`}
          className="object-cover rounded-2xl"
          width={1064}
          height={798}
          alt="poster"
        />
      </section>

      <section className="flexCenter flex-col mt-20">
        <p className="max-w-5xl text-xl font-normal">{data?.description}</p>

        <div className="flex flex-wrap mt-5 gap-5">
          {data?.githubUrl && (
            <Link
              href={data?.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flexCenter gap-2 tex-sm font-medium text-primary-purple"
            >
              <Image
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

          {data?.projectUrl && data?.githubUrl && (
            <Image src="/dot.svg" width={4} height={4} alt="dot" />
          )}
          {data?.projectUrl && (
            <Link
              href={data?.projectUrl}
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
            src={data?.creator?.avatarUrl}
            className="rounded-full"
            width={82}
            height={82}
            alt="profile image"
          />
        </Link>
        <span className="w-full h-0.5 bg-light-white-200" />
      </section>

      {/* <RelatedProjects
        userId={data?.creator?.id}
        projectId={data?.id}
      /> */}
    </Container>
  );
};

export default Project;
