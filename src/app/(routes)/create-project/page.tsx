import ProjectForm from "../_components/ProjectForm";

export default function CreateProjectPage() {
  return (
    <section className="mb-10">
      <h3 className="head-text my-10 md:!w-fit md:mx-auto">Create a New Project</h3>
      <ProjectForm type="create"/>
    </section>
  );
}
