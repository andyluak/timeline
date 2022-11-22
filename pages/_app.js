import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useState } from "react";
import "styles/globals.css";

export const GlobalContext = React.createContext({ isMobile: false });

export function GlobalContextWrapper({ children }) {
  const [width, setWidth] = useState(0);
  const isMobileState = width <= 768;

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    // unsubscribe from the event on component unmount
    return () => window.removeEventListener("resize", handleWindowResize);
  });
  return (
    <GlobalContext.Provider value={isMobileState}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return React.useContext(GlobalContext);
}

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
            refetchOnWindowFocus: false,
            cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
          },
        },
      })
  );
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <GlobalContextWrapper>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </GlobalContextWrapper>
  );
}

export default MyApp;
