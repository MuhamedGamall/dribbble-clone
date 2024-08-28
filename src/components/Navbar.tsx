"use client";
import Image from "next/image";
import Link from "next/link";

import { NavLinks } from "@/constant";

import ProfileMenu from "./ProfileMenu";
import Button from "./Button";
import { signIn, useSession, signOut } from "next-auth/react";
import { getCurrentSession } from "@/lib/actions";

const Navbar = () => {
  const session = useSession();
  return (
    <nav className="flexBetween navbar">
      <div className="flex-1 flexStart gap-10">
        <Link href="/">
          <Image src="/logo.svg" width={116} height={43} alt="logo" />
        </Link>
        <ul className="xl:flex hidden text-small gap-7">
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.text}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>

      <div className="flexCenter gap-4">
        {session.status === "authenticated" ? (
          <>
            <ProfileMenu session={session.data.user} />

            <Link href="/create-project">
              <Button title="Share work" />
            </Link>
          </>
        ) : (
          <Button
            title={session.status === "loading" ? "Loading..." : "Sign In"}
            handleClick={async () =>
              await signIn("google", { callbackUrl: "/" })
            }
            submitting={session.status === "loading"}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
