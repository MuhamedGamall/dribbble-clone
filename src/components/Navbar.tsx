import Image from "next/image";
import Link from "next/link";

import { CurrentSession } from "@/types";
import Container from "./Container";
import ProfileMenu from "./ProfileMenu";

const Navbar = ({
  session,
  loading,
}: {
  session: CurrentSession | null;
  loading: boolean;
}) => {
  return (
    <nav className=" navbar ">
      <Container>
        <div className="flexBetween   gap-4">
          <div className="flex-1 flexStart gap-10">
            <Link href="/">
              <Image
                loading="lazy"
                src="/logo.svg"
                width={116}
                height={43}
                alt="logo"
              />
            </Link>
          </div>

          {loading ? (
            <p className="bg-slate-200/50 py-3 rounded-[10px] w-[150px]" />
          ) : (
            <div className="flexCenter gap-4">
              <ProfileMenu session={session?.user} />
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
