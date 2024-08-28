import mongoose from "mongoose";

export default async function mongoConnect() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduce the selection timeout
      socketTimeoutMS: 45000, // Increase the socket timeout
      connectTimeoutMS: 10000, // Adjust connection timeout
    };
    await mongoose.connect(process.env.DATABASE_URL as string,options);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
}
