import Image from "next/image";
import Link from "next/link";
import React from "react";
import useDeviceSize from "../hooks/useDeviceSize";
import content from "../content.json";

function Navbar({ links }) {
  const { isMobile } = useDeviceSize();
  return (
    <navbar className="responsive-padding flex justify-between">
      {isMobile ? (
        <Image
          src="/icons/hamburger.svg"
          width={36}
          height={36}
          className="mb-[26px] cursor-pointer"
        />
      ) : (
        <div className="tracking-body mt-4 flex flex-row items-center gap-4">
          {links.map((l, i) => {
            return (
              <Link href={l.link} key={i}>
                {l.title}
              </Link>
            );
          })}
        </div>
      )}
      <Link href="/">
        <div className="absolute left-1/2 -top-5 flex -translate-x-1/2 items-center p-5">
          <Image src="/logo.svg" width={120} height={isMobile ? 100 : 200} />
        </div>
      </Link>
      <Link href="/sign-in">
        <button className="border border-black p-3 px-5 shadow-md hover:shadow-2xl">
          Sign In
        </button>
      </Link>
    </navbar>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      links: content.navLinks,
      hero: content.hero,
      features: content.features,
      useCases: content.useCases,
      copyright: content.copyright,
    },
  };
};

export default Navbar;
