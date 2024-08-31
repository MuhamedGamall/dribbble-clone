"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { updateProfile } from "@/lib/actions";
import { CurrentSession } from "@/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const ProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, { message: "Title must be at least 4 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .trim()
    .max(500, { message: "Description must be less than 500 characters" }),

  linkedinUrl: z
    .string()
    .trim()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),

  githubUrl: z.string().trim().url("Invalid URL").optional().or(z.literal("")),

  websiteUrl: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
});
export function UpdateProfileModel({
  session,
}: {
  session: CurrentSession | null;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      description: "",
      linkedinUrl: "",
      githubUrl: "",
      websiteUrl: "",
    },
  });

  useEffect(() => {
    if (session) {
      form.reset({
        name: session?.user?.name || "",
        description:
          session?.user?.description || "I’m Software Engineer at Microsoft 👋",
        linkedinUrl: session?.user?.linkedinUrl || "",
        githubUrl: session?.user?.githubUrl || "",
        websiteUrl: session?.user?.websiteUrl || "",
      });
    }
  }, [form]);
  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      if (!session) return;
      await updateProfile({
        ...values,
        name: values.name || session?.user?.name || "",
      });
      setOpen(false);
      return toast("Profile updated.", {
        description: "Your profile has been updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      return toast("Something went wrong.", {
        description: "Failed to Update profile. Please try again later.",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-3">
          <Edit size={20} /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full ">
            <div className="flex flex-col w-full items-center gap-4 py-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                disabled={form.formState.isSubmitting}
                name="name"
                label="Username"
                placeholder="Username"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                disabled={form.formState.isSubmitting}
                name="description"
                label="Description"
                placeholder="Iam front end devloper "
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                disabled={form.formState.isSubmitting}
                name="linkedinUrl"
                label="LinkedIn Url"
                placeholder="https://linkedin.com/example"
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
                fieldType={FormFieldType.INPUT}
                control={form.control}
                disabled={form.formState.isSubmitting}
                name="websiteUrl"
                label="website Url"
                placeholder="https://example.com"
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
