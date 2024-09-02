"use server";
import { ProjectSchema } from "@/app/(routes)/_components/ProjectForm";
import Project from "@/models/project";
import User from "@/models/user";
import { CurrentSession, ProjectInterface, UserProfile } from "@/types";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoConnect from "./mongo-connect";
import { authOptions } from "./session";
import { parseStringify } from "./utils";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "@/app/(routes)/profile/[id]/_components/UpdateProfile";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCurrentSession() {
  try {
    let loading = true;
    const session = await getServerSession(authOptions);
    loading = false;

    return { session: parseStringify(session), loading } as {
      session: CurrentSession | null;
      loading: boolean;
    };
  } catch (error) {
    console.log(error);
    return { session: null, loading: false };
  }
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

    return parseStringify(create);
  } catch (error: any) {
    console.log("[CREATE_USER]", error.message);
    throw error;
  }
};

export const getUser = async ({
  email,
  userId,
}: {
  email?: string;
  userId?: string;
}) => {
  try {
    await mongoConnect();

    if (userId || email) {
      const user = await User.findOne(
        email ? { email } : { _id: userId }
      ).lean();

      if (!user) {
        console.log("User not found");
        return null;
      }

      return parseStringify(user) as UserProfile | null;
    }
    throw new Error("No user email or user id provided");
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
    const { session } = await getCurrentSession();
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
    revalidatePath("create-project", "page");
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
    const { session } = await getCurrentSession();
    if (!session) throw new Error("Unauthorized");
    const creatorId = session?.user._id;

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

    revalidatePath("update-project", "page");
    const project = await findProject();
    return parseStringify(project) as ProjectInterface;
  } catch (error: any) {
    console.error("Error creating project:", error.message);
    throw error;
  }
};

export const fetchProjects = async ({
  searchQuery,
  favoritesOnly,
  followingOnly,
}: {
  searchQuery?: string;
  favoritesOnly?: boolean;
  followingOnly?: boolean;
}) => {
  try {
    await mongoConnect();
    let isLoading = true;

    const { session } = await getCurrentSession();
    const favoritesIds = session?.user?.favorites?.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const followingIds = session?.user?.following?.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    let filter = {} as any;

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

    if (favoritesOnly) {
      filter._id = { $in: favoritesIds };
    }
    if (followingOnly) {
      filter["creator._id"] = { $in: followingIds };
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
    const { session } = await getCurrentSession();
    if (!session) throw new Error("Unauthorized");
    const favoritesIds = session?.user?.favorites?.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    await mongoConnect();

    let project = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $addFields: {
          isFavorite: { $in: ["$_id", favoritesIds || []] },
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
  limit = 0,
}: {
  projectIdForIgnore?: string;
  userId: string;
  limit?: number;
}) => {
  try {
    await mongoConnect();
    let isLoading = true;

    const { session } = await getCurrentSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    if (!userId) throw new Error("userId not found");

    const favoritesIds = session?.user?.favorites?.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const get_user = await getUser({
      userId,
    });

    if (!get_user) throw new Error("user not found");

    const projectsIds =
      get_user.projects.map((el) => new mongoose.Types.ObjectId(el)) || [];

    if (!session) throw new Error("Unauthorized");

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
          isFavorite: { $in: ["$_id", favoritesIds || []] },
        },
      },
      ...(limit > 0 ? [{ $limit: limit }] : []),
    ]);

    isLoading = false;
    return {
      projects: parseStringify(projects),
      isLoading,
      user: parseStringify(get_user),
    } as {
      projects: ProjectInterface[];
      isLoading: boolean;
      user: UserProfile;
    };
  } catch (error: any) {
    console.error("Error fetching project:", error.message);
    throw error;
  }
};
export const deleteProject = async (id: string) => {
  try {
    const { session } = await getCurrentSession();

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
    const { session } = await getCurrentSession();

    if (!session) throw new Error("Unauthorized");
    await mongoConnect();
    const userData = (await getUser({ email: session.user.email })) as any;
    const findProject = await Project.findById(id);

    if (!findProject) throw new Error("Project not found");
    const favorites = userData?.favorites?.map(String) as string[];
    const { ObjectId } = mongoose.Types;

    const updateId = new ObjectId(id);

    let status = null;
    if (favorites.includes(updateId.toString())) {
      status = await User.updateOne(
        { _id: session.user._id, email: session?.user?.email },
        { $pull: { favorites: updateId } }
      );
      await Project.updateOne({ _id: updateId }, { $inc: { likesCount: -1 } });
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
export const addProjectViewCount = async (id: string, pathname: string) => {
  try {
    const { session } = await getCurrentSession();

    if (!session) throw new Error("Unauthorized");
    await mongoConnect();

    const findProject = await Project.findById(id);

    if (!findProject) throw new Error("Project not found");

    const userSeeingIds = session?.user?.seeing?.map(String) as string[];
    let status = null;
    if (!userSeeingIds.includes(id.toString())) {
      await User.findByIdAndUpdate(session.user._id, {
        $addToSet: { seeing: id },
      });
      status = await Project.updateOne(
        { _id: id },
        { $inc: { viewership: 1 } }
      );
    }
    revalidatePath(pathname || "/", "page");
    return parseStringify(status) as any;
  } catch (error: any) {
    console.error("Error in adding project view count:", error.message);
    throw error;
  }
};
export const updateProfile = async (data: z.infer<typeof ProfileSchema>) => {
  try {
    const { session } = await getCurrentSession();
    if (!session) throw new Error("Unauthorized");
    if (!data.name) {
      throw new Error("Name is required");
    }
    await mongoConnect();
    const update = await User.updateOne(
      { _id: session.user._id },
      {
        ...data,
        ...(data.name.trim() && { name: data.name }),
      }
    );
    revalidatePath("/profile/" + session.user._id, "page");
  } catch (error: any) {
    console.error("Error in updating profile:", error.message);
    throw error;
  }
};
export const toggleFollow = async (id: string, pathname: string) => {
  try {
    const { session } = await getCurrentSession();

    if (!session) throw new Error("Unauthorized");
    await mongoConnect();
    const userData = (await getUser({ userId: id })) as any;
    const followingIds = session?.user?.following?.map(String) as string[];

    if (!userData) throw new Error("User you are trying to follow not found");
    const { ObjectId } = mongoose.Types;

    const updateId = new ObjectId(id);

    let status = null;
    if (followingIds.includes(id.toString())) {
      status = await User.updateOne(
        { _id: session.user._id, email: session?.user?.email },
        { $pull: { following: updateId } }
      );
      await User.updateOne({ _id: updateId }, { $inc: { followersCount: -1 } });
    } else {
      status = await User.updateOne(
        { _id: session.user._id, email: session?.user?.email },
        { $addToSet: { following: updateId } }
      );
      await User.updateOne({ _id: updateId }, { $inc: { followersCount: 1 } });
    }

    revalidatePath(pathname || "/", "page");
    return parseStringify(status) as any;
  } catch (error: any) {
    console.error("Error when toggle follow or unfollow:", error.message);
    throw error;
  }
};
export const getFollowing = async () => {
  try {
    let loading = true;
    const { session } = await getCurrentSession();

    if (!session) throw new Error("Unauthorized");
    await mongoConnect();

    const followingIds = session?.user?.following?.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const followingData = await User.aggregate([
      {
        $match: {
          _id: { $in: followingIds },
        },
      },
      {
        $addFields: {
          isFollowed: { $in: ["$_id", followingIds || []] },
        },
      },
    ]);
    loading = false;
    return { followingData: parseStringify(followingData), loading } as {
      followingData: UserProfile[] | [];
      loading: boolean;
    };
  } catch (error: any) {
    console.error("Error getting user iam following: ", error.message);
    throw error;
  }
};
