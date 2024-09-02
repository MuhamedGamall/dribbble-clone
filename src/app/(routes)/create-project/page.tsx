import ProjectForm from "../_components/ProjectForm";
import Container from "@/components/Container";

export default async function CreateProjectPage() {
  return (
    <section className="mb-10 ">
      <Container className="!px-10">
        <h3 className="head-text my-10 md:!w-fit md:mx-auto">
          Create a New Project
        </h3>
        <ProjectForm type="create" />
      </Container>
    </section>
  );
}
