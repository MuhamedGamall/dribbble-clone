"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { FileUploader } from "@/components/FileUploader";
import { categoryFilters } from "@/constant";
import { toast } from "sonner";
import Button from "@/components/Button";
import { SelectItem } from "@/components/ui/select";
import { createProject } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/types";
import { Session } from "next-auth";

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
    .any()
    .refine((value) => value !== "", { message: "Please upload image" }),

  projectUrl: z.string().trim(),
  githubUrl: z.string().trim(),
  category: z
    .string()
    .trim()
    .refine((value) => value !== "", { message: "Please select category" }),
});

export default function ProjectForm({ type }: { type: "create" | "update" }) {
  const router = useRouter();
  const session = useSession() as any;
  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: null,
      projectUrl: "",
      githubUrl: "",
      category: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof ProjectSchema>) => {
    try {
      if (type === "create") {
        await createProject({
          data: values,
          creatorId: session?.data?.user?._id,
        }).then(() => router.push("/"));
      }

      if (type === "update") {
        // await updateProject(form, project?.id as string, token);
        router.push("/");
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
        className="max-w-[800px] mx-auto space-y-6"
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
          name="gethubUrl"
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
            leftIcon={form.formState.isSubmitting ? "" : "/plus.svg"}
            submitting={form.formState.isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
