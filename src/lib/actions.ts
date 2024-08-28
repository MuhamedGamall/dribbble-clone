"use server";
import { ProjectSchema } from "@/app/(routes)/_components/ProjectForm";
import { Project } from "@/models/project";
import { User } from "@/models/user";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoConnect from "./mongo-connect";
import { authOptions } from "./session";
import axios from "axios";
import { parseStringify } from "./utils";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCurrentSession() {
  const session = await getServerSession(authOptions);
  return session;
}
export const createUser = async (userData: {
  name: string;
  email: string;
  avatarUrl: string;
}) => {
  try {
    await mongoConnect();

    if (!userData) {
      throw new Error("No user data provided");
    }
    const create = await User.create(userData);

    return create;
  } catch (error: any) {
    console.log("[CREATE_USER]", error.message);
    throw error;
  }
};

export const getUser = async (email: string) => {
  try {
    await mongoConnect();

    if (!email) {
      throw new Error("No user email provided");
    }

    const user = await User.findOne({ email }).lean();

    if (!user) {
      console.log("User not found");

      return null;
    }

    return user;
  } catch (error: any) {
    console.error("[GET_USER] Error fetching user:", error.message);
    throw error;
  }
};
export async function uploadImage(image: string) {
  try {
    if (!image) {
      throw new Error("Image path is required");
    }
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [{ width: 1000, height: 752, crop: "scale" }],
    };

    const result = await cloudinary.uploader.upload(
      JSON.stringify(image),
      options
    );
    // const result = await axios.post(`${appUrl}/api/cloudinary`, image);

    return result;
  } catch (error: any) {
    console.log("Failed to upload image on Cloudinary", error.message);
    throw error;
  }
}
export const createProject = async ({
  data,
  creatorId,
}: {
  data: z.infer<typeof ProjectSchema>;
  creatorId: string;
}) => {
  try {
    // const currentSession = await getCurrentSession();

    // if (!currentSession) throw new Error("Unauthorized");

    await mongoConnect();
    const image = (
      await axios.post(`${appUrl}/api/cloudinary`, JSON.stringify(data.image))
    ).data;

    console.log({ image });

    const posterUrl = image?.url;
    const posterId = image?.public_id;
    if (!image)
      throw new Error("Failed to upload image before creating project");

    if (!creatorId) throw new Error("Creator Id not found");

    const creator = await User.findById(creatorId);

    if (!creator) throw new Error("Creator not found");

    const newProject = await Project.create({
      ...data,
      posterId,
      posterUrl,
      createdBy: creator._id,
    });
    return parseStringify(newProject);
  } catch (error: any) {
    console.error("Error creating project:", error.message);
    throw error;
  }
};
