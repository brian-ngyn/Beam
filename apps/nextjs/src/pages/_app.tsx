import "../styles/globals.css";
import type { AppType } from "next/app";
import { TRPCProvider } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <TRPCProvider>
      <Component {...pageProps} />
    </TRPCProvider>
  );
};

export default MyApp;
