import EmptyState from "@/components/EmptyState";
import { getProject } from "@/lib/actions";
import ProjectForm from "../../_components/ProjectForm";
import Container from "@/components/Container";
import LoaderProvider from "@/components/providers/LoaderProvider";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const { project, isLoading } = await getProject(id);
  if (!project) {
    return (
      <section className="flexStart flex-col paddings">
        <EmptyState
          title="Failed to fetch project info"
          subtitle="No project found"
        />
      </section>
    );
  }

  return (
    <LoaderProvider isLoading={isLoading}>
      <section className="mb-10">
        <Container>
          <h3 className="head-text my-10 md:!w-fit md:mx-auto">
            Update Project
          </h3>
          <ProjectForm type="update" project={project} />
        </Container>
      </section>
    </LoaderProvider>
  );
};

export default EditProject;
