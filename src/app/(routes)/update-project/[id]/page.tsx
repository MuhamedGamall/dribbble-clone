
import EmptyState from "@/components/EmptyState";
import { getProject } from "@/lib/actions";
import ProjectForm from "../../_components/ProjectForm";
import Container from "@/components/Container";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const data = await getProject(id);
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

  return (
    
    <section className="mb-10">
      <Container>
      <h3 className="head-text my-10 md:!w-fit md:mx-auto">Update Project</h3>
      <ProjectForm type="update" project={data} />
    </Container>
    </section>
  );
};

export default EditProject;
