"use server";
import { ProjectSchema } from "@/app/(routes)/_components/ProjectForm";
import Project from "@/models/project";
import User from "@/models/user";
import { ProjectInterface } from "@/types";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoConnect from "./mongo-connect";
import { authOptions } from "./session";
import { parseStringify } from "./utils";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCurrentSession() {
  const session = await getServerSession(authOptions);
  return session as any;
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

export const createProject = async ({
  data,
}: {
  data: z.infer<typeof ProjectSchema>;
}) => {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error("Unauthorized");
    const creatorId = session?.user?._id;

    await mongoConnect();

    const image = (
      await axios.post(`${appUrl}/api/cloudinary`, {
        session,
        image: data.image,
      })
    ).data;
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
      creator: {
        _id: creator._id,
        name: creator.name,
        email: creator.email,
        avatarUrl: creator.avatarUrl,
      },
    });

    const updateUser = await User.findByIdAndUpdate(session.user._id, {
      $addToSet: { projects: newProject._id },
    });

    return parseStringify(newProject) as ProjectInterface;
  } catch (error: any) {
    console.error("Error creating project:", error.message);
    throw error;
  }
};
function isBase64DataURL(value: string) {
  const base64Regex = /^data:image\/[a-z]+;base64,/;
  return base64Regex.test(value);
}
export const updateProject = async ({
  data,
  projectId,
  posterId: posterIdForDelete,
}: {
  data: z.infer<typeof ProjectSchema>;
  projectId: string;
  posterId: string;
}) => {
  try {
    const session = await getCurrentSession();
    if (!session) throw new Error("Unauthorized");
    const creatorId = session?.user?._id;

    await mongoConnect();

    if (!creatorId) throw new Error("Creator Id not found");

    const creator = await User.findById(creatorId);

    if (!creator) throw new Error("Creator not found");

    const findProject = async () =>
      await Project.findOne({
        _id: projectId,
        "creator._id": creatorId,
        "creator.email": creator.email,
      });

    if (!(await findProject())) throw new Error("Project not found");

    let updatedData = data as any;
    const isUploadingNewImage = isBase64DataURL(data.image);
    if (isUploadingNewImage) {
      const image = (
        await axios.put(`${appUrl}/api/cloudinary`, {
          session,
          image: data.image,
          deleteImageId: posterIdForDelete,
        })
      ).data;
      if (image) {
        updatedData.image;
      } else {
        throw new Error("Failed to upload image before updating project");
      }
      updatedData.posterUrl = image?.url;
      updatedData.posterId = image?.public_id;
    }

    await Project.updateOne(
      {
        _id: projectId,
        "creator._id": creatorId,
        "creator.email": creator.email,
      },
      {
        ...data,
      }
    );
    const project = await findProject();
    return parseStringify(project) as ProjectInterface;
  } catch (error: any) {
    console.error("Error creating project:", error.message);
    throw error;
  }
};

export const fetchProjects = async ({
  searchQuery,
}: {
  searchQuery?: string;
}) => {
  try {
    await mongoConnect();
    const session = await getCurrentSession();
    const favoritesIds = session?.user?.favorites;
    let filter = {};
    let isLoading = true;

    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      filter = {
        $or: [
          { title: { $regex: regex } },
          { category: { $regex: regex } },
          { "creator.name": { $regex: regex } },
        ],
      };
    }

    const projects = await Project.aggregate([
      { $match: filter },
      {
        $addFields: {
          isFavorite: { $in: ["$_id", favoritesIds || []] },
        },
      },
    ]);
    isLoading = false;
    return {
      projects: parseStringify(projects),
      isLoading,
    } as { projects: ProjectInterface[]; isLoading: boolean };
  } catch (error: any) {
    console.error("Error fetching projects:", error.message);
    throw error;
  }
};
export const getProject = async (id: string, pathname: string) => {
  try {
    let isLoading = true;
    const session = await getCurrentSession();
    if (!session) throw new Error("Unauthorized");

    await mongoConnect();

    let project = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $addFields: {
          isFavorite: { $in: ["$_id", session?.user?.favorites || []] },
        },
      },
    ]);

    project = project[0];
    if (!project) throw new Error("Project not found");
    if (pathname) revalidatePath(pathname, "page");

    isLoading = false;
    return {
      project: parseStringify(project),
      isLoading,
    } as { project: ProjectInterface; isLoading: boolean };
  } catch (error: any) {
    console.error("Error fetching project:", error.message);
    throw error;
  }
};
export const getUserProjects = async ({
  projectIdForIgnore,
  userId,
  projectsIds,
}: {
  projectIdForIgnore?: string;
  userId?: string;
  projectsIds?: string[];
}) => {
  try {
    let isLoading = true;

    const session = await getCurrentSession();
    if (!session) throw new Error("Unauthorized");

    await mongoConnect();
    if (!userId) throw new Error("userId  not found");
    if (!projectIdForIgnore) throw new Error("projectIdForIgnore not found");

    const projects = await Project.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(projectIdForIgnore),
            $in: projectsIds,
          },
          "creator._id": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $addFields: {
          isFavorite: { $in: ["$_id", session?.user?.favorites || []] },
        },
      },
    ]);

    // .find({
    //   _id: { $ne: projectIdForIgnore, $in: projectsIds },
    //   "creator._id": userId,
    // });
    isLoading = false;

    return {
      projects: parseStringify(projects),
      isLoading,
    } as { projects: ProjectInterface[]; isLoading: boolean };
  } catch (error: any) {
    console.error("Error fetching project:", error.message);
    throw error;
  }
};
export const deleteProject = async (id: string) => {
  try {
    const session = await getCurrentSession();

    if (!session) throw new Error("Unauthorized");
    await mongoConnect();

    const findProject = await Project.findOne({
      _id: id,
      "creator.email": session?.user?.email,
      "creator._id": session?.user?._id,
    });

    if (!findProject) throw new Error("Project not found");

    const project = await Project.deleteOne({
      _id: id,
      "creator.email": session?.user?.email,
      "creator._id": session?.user?._id,
    });

    const updateUser = await User.findByIdAndUpdate(session.user._id, {
      $pull: { projects: id, favorites: id },
    });
    await axios.delete(`${appUrl}/api/cloudinary?id=${findProject.posterId}`);
    await User.updateOne({
      _id: session.user._id,
      email: session?.user?.email,
    });
    return parseStringify(project);
  } catch (error: any) {
    console.error("Error deleting project:", error.message);
    throw error;
  }
};
export const toggleFavorite = async (id: string, pathname: string) => {
  try {
    const session = await getCurrentSession();

    if (!session) throw new Error("Unauthorized");
    await mongoConnect();
    const userData = (await getUser(session.user.email)) as any;
    const findProject = await Project.findById(id);

    if (!findProject) throw new Error("Project not found");
    const favorites = userData.favorites.map(String) as string[];
    const { ObjectId } = mongoose.Types;

    const updateId = new ObjectId(id);

    let status = null;
    if (favorites.includes(updateId.toString())) {
      status = await User.updateOne(
        { _id: session.user._id, email: session?.user?.email },
        { $pull: { favorites: updateId } }
      );
        await Project.updateOne(
          { _id: updateId },
          { $inc: { likesCount: -1 } }
        );
    } else {
      status = await User.updateOne(
        { _id: session.user._id, email: session?.user?.email },
        { $addToSet: { favorites: updateId } }
      );
      await Project.updateOne({ _id: updateId }, { $inc: { likesCount: 1 } });
    }

    revalidatePath(pathname || "/", "page");
    return parseStringify(status) as any;
  } catch (error: any) {
    console.error("Error toggle favorite:", error.message);
    throw error;
  }
};
export const getFavorites = async () => {
  try {
    const session = await getCurrentSession();

    if (!session) throw new Error("Unauthorized");
    await mongoConnect();

    const favorites = session.user.favorites;

    const projects = await Project.find({ _id: { $in: favorites } });

    return parseStringify(projects);
  } catch (error: any) {
    console.error("Error getting favorites: ", error.message);
    throw error;
  }
};
// export const updateL = async () => {
//   try {
//     const session = await getCurrentSession();

//     if (!session) throw new Error("Unauthorized");
//     await mongoConnect();

//     const favorites = session.user.favorites;

//     const projects = await Project.find({ _id: { $in: favorites } });

//     return parseStringify(projects);
//   } catch (error: any) {
//     console.error("Error getting favorites: ", error.message);
//     throw error;
//   }
// };
