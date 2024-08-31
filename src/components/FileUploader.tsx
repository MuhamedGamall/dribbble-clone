"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { cn, convertFileToUrl } from "@/lib/utils";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";

type FileUploaderProps = {
  file: File;
  onChange: (file: string) => void;
  disabled?: boolean;
};

export const FileUploader = ({
  file,
  onChange,
  disabled,
}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 1)
      return toast("Something went wrong.", {
        description: "Only one image can be uploaded at a time.",
        duration: 3000,
      });
    if (
      ![
        "image/png",
        "image/jpeg",
        "image/svg",
        "image/webp",
        "image/apng",
      ].includes(acceptedFiles?.[0]?.type)
    )
      return toast("Something went wrong.", {
        description: 'Supported formats: "png", "jpeg", "svg", "webp", "apng",',
        duration: 3000,
      });

    const reader = new FileReader();

    reader.readAsDataURL(acceptedFiles?.[0]);

    reader.onload = () => {
      const result = reader.result as string;
      onChange(result);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
      "image/apng": [".apng"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn("file-upload", { "cursor-none": disabled })}
    >
      <input
        disabled={disabled}
        {...getInputProps()}
        accept="image/png, image/jpeg, image/svg, image/webp, image/apng"
      />
      {file ? (
        <Image
          loading="lazy"
          src={file + ""}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <UploadIcon className="h-6 w-6 text-slate-600" />
          <div className="file-upload_label">
            <p className="text-14-regular ">
              <span className="text-green-500">Click to upload </span>
              or drag and drop
            </p>
            <p className="text-[12px] text-foreground  ">
              SVG, PNG, JPG, APNG, WEBP
            </p>
          </div>
        </>
      )}
    </div>
  );
};
