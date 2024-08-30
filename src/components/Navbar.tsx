"use client";
import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "@/constant";

import { signIn, useSession } from "next-auth/react";
import Button from "./Button";
import Container from "./Container";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const session = useSession();
  return (
    <nav className=" navbar ">
      <Container>
        <div  className="flexBetween   gap-4">
          <div className="flex-1 flexStart gap-10">
            <Link href="/">
              <Image src="/logo.svg" width={116} height={43} alt="logo" />
            </Link>
          
          </div>

          {session.status == "loading" ? (
            <p className="bg-slate-200/50 py-3 rounded-[10px] w-[150px]" />
          ) : (
            <div className="flexCenter gap-4">
              {session.status === "authenticated" ? (
                <ProfileMenu session={session.data.user} />
              ) : (
                <Button
                  iconWidth={25}
                  leftIcon={
                    "https://img.icons8.com/?size=100&id=17950&format=png&color=ffffff"
                  }
                  title={"Sign In"}
                  handleClick={async () =>
                    await signIn("google", { callbackUrl: "/" })
                  }
                />
              )}
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
