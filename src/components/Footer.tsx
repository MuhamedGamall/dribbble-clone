import { CopyrightIcon } from "lucide-react";
import Image from "next/image";

const dateNow = new Date().getFullYear();
const Footer = () => (
  <section className="flexStart footer">
    <div className="flex flex-col gap-12 w-full">
      <div className="flex items-start flex-col">
        <Image
          loading="lazy"
          src="/logo-purple.svg"
          width={116}
          height={38}
          alt="logo"
        />

        <p className="text-start text-sm font-normal mt-5 max-w-xs">
          Flexibble is the world&apos;s leading community for creatives to
          share, grow, and get hired.
        </p>
      </div>
    </div>

    <div className="flexBetween footer_copyright">
      <p className="flex items-center gap-1">
        <CopyrightIcon size={12}/> {dateNow} Flexibble. All rights reserved
      </p>
      <p className="text-gray">
        <span className="text-black font-semibold">24,700,000+</span> projects
        submitted
      </p>
    </div>
  </section>
);

export default Footer;
