"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Fragment, useState } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Session } from "next-auth";
import { UserProfile } from "@/types";

const ProfileMenu = ({ session }: { session: Session | any }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flexCenter z-10 flex-col relative ">
      <Menu as="div">
        <MenuButton
          className="flexCenter  bg-transparent"
          onMouseEnter={() => setOpenModal(true)}
        >
          {session?.image && (
            <Image
              src={session?.image}
              width={40}
              height={40}
              className="rounded-full"
              alt="user profile image"
            />
          )}
        </MenuButton>

        <Transition
          show={openModal}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            static
            className="flexStart profile_menu-items"
            onMouseLeave={() => setOpenModal(false)}
          >
            <Link
              href={`/profile/${session?._id}`}
              className="flex flex-col items-center gap-y-2"
            >
              {session?.image && (
                <Image
                  src={session?.image}
                  className="rounded-full"
                  width={80}
                  height={80}
                  alt="profile Image"
                />
              )}
              <p className="font-semibold md:text-2xl capitalize">{session?.name}</p>
            </Link>

            <div className="w-full flexStart border-t border-nav-border mt-5 pt-5">
              <MenuItem>
                <button
                  type="button"
                  className="text-sm"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
