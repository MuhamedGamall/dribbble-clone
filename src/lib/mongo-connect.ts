import mongoose from "mongoose";

export default async function mongoConnect() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string)
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
}
