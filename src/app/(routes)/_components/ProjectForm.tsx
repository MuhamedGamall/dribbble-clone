"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { FileUploader } from "@/components/FileUploader";
import { categoryFilters } from "@/constant";
import { toast } from "sonner";
import Button from "@/components/Button";
import { SelectItem } from "@/components/ui/select";
import { createProject, updateProject } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { ProjectInterface, UserProfile } from "@/types";
import { Session } from "next-auth";
const strictUrlPattern =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const ProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, { message: "Title must be at least 4 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .trim()
    .max(500, { message: "Description must be less than 500 characters" }),
  image: z
    .string()
    .refine((value) => value !== "", { message: "Please upload image" }),

  projectUrl: z.string().trim().url("Invalid URL").optional().or(z.literal("")),

  githubUrl: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  category: z
    .string()
    .trim()
    .refine((value) => value !== "", { message: "Please select category" }),
});

export default function ProjectForm({
  type,
  project,
}: {
  type: "create" | "update";
  project?: ProjectInterface;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      projectUrl: "",
      githubUrl: "",
      category: "",
    },
  });

  useEffect(() => {
    if (type === "update" && project) {
      form.reset({
        title: project.title,
        description: project.description,
        image: project.posterUrl,
        projectUrl: project.projectUrl,
        githubUrl: project.githubUrl,
        category: project.category,
      });
    }
  }, [project, type, form]);

  const onSubmit = async (values: z.infer<typeof ProjectSchema>) => {
    try {
      if (type === "create") {
        await createProject({
          data: values,
        }).then(() => {
          router.replace("/");
          router.refresh();
        });
      }

      if (type === "update" && project) {
        const updatedProject = await updateProject({
          data: values,
          projectId: project?._id,
          posterId: project?.posterId,
        }).then(() => {
          router.replace("/");
          router.refresh();
        }) as any
        form.setValue("image", updatedProject.posterUrl) ;
      }
    } catch (error) {
      console.error(error);
      return toast("Something went wrong.", {
        description: `Failed to ${
          type === "create" ? "create" : "update"
        } a project. Try again!`,
        duration: 3000,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[800px] mx-auto space-y-6 "
      >
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="image"
          disabled={form.formState.isSubmitting}
          label="Project poster"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader file={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="title"
          disabled={form.formState.isSubmitting}
          label="Project title"
          placeholder="title"
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="description"
          label="Description"
          disabled={form.formState.isSubmitting}
          placeholder="description"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          disabled={form.formState.isSubmitting}
          name="projectUrl"
          label="Project Url"
          placeholder="https://example.com"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          disabled={form.formState.isSubmitting}
          name="githubUrl"
          label="Github Url"
          placeholder="https://github.com/example"
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="category"
          disabled={form.formState.isSubmitting}
          label="Category"
          placeholder="category"
          defaultValue={project?.category || ""}
          children={categoryFilters.map((cate, i) => (
            <SelectItem key={cate + i} value={cate}>
              {cate}
            </SelectItem>
          ))}
        />
        <div className="flexStart ">
          <Button
            className="!w-fit"
            title={
              form.formState.isSubmitting
                ? `${type === "create" ? "Creating" : "Updating"}...`
                : `${type === "create" ? "Create" : "Update"} Project`
            }
            type="submit"
            leftIcon={
              form.formState.isSubmitting
                ? ""
                : type === "create"
                ? "/plus.svg"
                : ""
            }
            submitting={form.formState.isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
