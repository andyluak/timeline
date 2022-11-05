import Image from "next/image";
import Link from "next/link";
import React from "react";

import useDeviceSize from "hooks/useDeviceSize";
import useUser from "hooks/useUser";

import content from "../content.json";

function Navbar({ links }) {
  const { isMobile } = useDeviceSize();
  const { isLoggedIn } = useUser();
  return (
    <nav className="responsive-padding mb-2 flex items-center justify-between">
      {isMobile ? (
        <Image
          src="/icons/hamburger.svg"
          width={36}
          height={36}
          className="mb-[26px] cursor-pointer"
          alt="hamburger menu"
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
        <Image
          src="/logo.svg"
          width={80}
          height={isMobile ? 70 : 200}
          alt="logo"
        />
      </Link>
      {isLoggedIn ? (
        <Link href="/my-account">
          <button className="border border-black p-3 px-5 shadow-md hover:shadow-2xl">
            My Account
          </button>
        </Link>
      ) : (
        <Link href="/sign-in">
          <button className="border border-black p-3 px-5 shadow-md hover:shadow-2xl">
            Sign In
          </button>
        </Link>
      )}
    </nav>
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
