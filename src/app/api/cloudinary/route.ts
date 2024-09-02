import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req: NextRequest) {
  try {
    const { image, session } = await req.json();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
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
        { width: 1000, height: 752, crop: "fit" },
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
export async function PUT(req: NextRequest) {
  try {
    const { image, session, deleteImageId } = await req.json();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!image) {
      return NextResponse.json(
        { message: "Image path is required" },
        { status: 400 }
      );
    }
    if (!deleteImageId) {
      return NextResponse.json(
        { message: "image id is required" },
        { status: 400 }
      );
    }
    let options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      format: "webp", 
      transformation: [
        { width: 1000, height: 752, crop: "fit" },
        { quality: "auto:good" }, 
      ],
    };

    await cloudinary.api.delete_resources([deleteImageId], {
      invalidate: true,
    });

    const updateResult = await cloudinary.uploader.upload(image, options);

    return NextResponse.json(updateResult);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to Update image on Cloudinary" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const deleteImageId = req.nextUrl.searchParams.get("id");

    if (!deleteImageId) {
      return NextResponse.json(
        { message: "image id is required" },
        { status: 400 }
      );
    }

    const deleteImg = await cloudinary.api.delete_resources([deleteImageId], {
      invalidate: true,
    });

    return NextResponse.json(deleteImg);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to Delete image from Cloudinary" },
      { status: 500 }
    );
  }
}
