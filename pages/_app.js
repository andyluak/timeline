import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "styles/globals.scss";

import { getAuthCookie, removeAuthCookie } from "utils/cookie";
import IdleTimer from "utils/idleTimer";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const signOutUser = () => {
    const token = getAuthCookie();

    if (token) {
      removeAuthCookie();
      router.push("/sign-in");
    }
  };
  // useEffect(() => {
  //   const timer = new IdleTimer({
  //     timeout: 12,
  //     onTimeout: () => {
  //       signOutUser();
  //     },
  //     onExpired: () => {
  //       signOutUser();
  //     },
  //   });

  //   return () => {
  //     timer.cleanUp();
  //   };
  // }, []);
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
