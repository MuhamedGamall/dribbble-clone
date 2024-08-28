import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentSession } from "@/lib/actions";
import mongoConnect from "@/lib/mongo-connect";
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req: NextRequest) {
  try {
    // const currentSession = await getCurrentSession();
    // console.log({ currentSession });

    // if (!currentSession) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }
    const image = await req.json();

    if (!image) {

      return NextResponse.json(
        { message: "Image path is required" },
        { status: 400 }
      );
    }

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [
        { format: "webp" },
        { width: 1000, height: 752, crop: "scale" },
      ],
    };

    const result = await cloudinary.uploader.upload(image, options);

    return NextResponse.json(result);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to upload image on Cloudinary" },
      { status: 500 }
    );
  }
}
