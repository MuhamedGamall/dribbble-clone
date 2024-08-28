"use server";
import { User } from "@/models/user";
import { getServerSession } from "next-auth";
import mongoConnect from "./mongo-connect";
import { authOptions } from "./session";

// export const uploadImage = async (imagePath: string) => {
//   try {
//     const response = await fetch(`${serverUrl}/api/upload`, {
//       method: "POST",
//       body: JSON.stringify({
//         path: imagePath,
//       }),
//     });
//     return response.json();
//   } catch (err) {
//     throw err;
//   }
// };
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
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    console.error("[GET_USER] Error fetching user:", error.message);
    throw error;
  }
};
