"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  id: string;
  posterUrl: string;
  title: string;
  name: string;
  avatarUrl: string;
  userId: string;
};

const ProjectCard = ({
  id,
  posterUrl,
  title,
  name,
  avatarUrl,
  userId,
}: Props) => {
  const [randomLikes, setRandomLikes] = useState(0);
  const [randomViews, setRandomViews] = useState("");

  useEffect(() => {
    setRandomLikes(Math.floor(Math.random() * 10000));
    setRandomViews(
      String((Math.floor(Math.random() * 10000) / 1000).toFixed(1) + "k")
    );
  }, []);

  return (
    <div className="flexCenter flex-col rounded-2xl  ">
      <Link href={`/project/${id}`} className="flexCenter group relative">
        <Image
          src={posterUrl}
          width={414}
          height={314}
          className="w-full aspect-[5/4.5]  h-full object-cover rounded-2xl"
          alt="project image"
        />

        <div className="hidden group-hover:flex profile_card-title ">
          <p className="w-full truncate ">{title}</p>
        </div>
      </Link>

      <div className="flexBetween w-full px-2 mt-3 font-semibold text-sm">
        <Link href={`/profile/${userId}`}>
          <div className="flexCenter gap-2">
            <Image
              src={avatarUrl}
              width={24}
              height={24}
              className="rounded-full"
              alt="profile image"
            />
            <p className="text-[10px] truncate">{name}</p>
          </div>
        </Link>

        <div className="flexCenter gap-3">
          <div className="flexCenter gap-2">
            <Image src="/hearth.svg" width={13} height={12} alt="heart" />
            <p className="text-sm">{randomLikes}</p>
          </div>
          <div className="flexCenter gap-2">
            <Image src="/eye.svg" width={12} height={9} alt="eye" />
            <p className="text-sm">{randomViews}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
