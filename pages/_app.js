import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "styles/globals.css";
import { getAuthCookie, removeAuthCookie } from "utils/cookie";
import IdleTimer from "utils/idleTimer";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const signOutUser = () => {
    const token = getAuthCookie();

    if (token) {
      removeAuthCookie();
      router.push("/sign-in").then(() => router.reload());
    }
  };
  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 120,
      onTimeout: () => {
        signOutUser();
      },
      onExpired: () => {
        signOutUser();
      },
    });

    return () => {
      timer.cleanUp();
    };
  }, []);
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
