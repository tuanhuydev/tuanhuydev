import "@frontend/styles/globals.css";
import type { AppProps } from "next/app";
import WithProvider from "@frontend/components/hocs/WithProvider";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WithProvider context={{ theme: 'light' }}>
      <Component {...pageProps} />
    </WithProvider>
  );
}

export default MyApp;
