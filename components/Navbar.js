import Image from "next/image";
import Link from "next/link";
import React from "react";
import useDeviceSize from "hooks/useDeviceSize";
import content from "content.json";
import useUser from "hooks/useUser";

function Navbar({ links }) {
  const { isMobile } = useDeviceSize();
  const { isLoggedIn } = useUser();
  return (
    <nav className="responsive-padding mb-2 flex justify-between">
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
        <div className="absolute left-1/2 -top-5 mt-5 flex -translate-x-1/2 items-center">
          <Image
            src="/logo.svg"
            width={120}
            height={isMobile ? 70 : 200}
            alt="logo"
          />
        </div>
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
