import "@frontend/styles/globals.css";
import type { AppProps } from "next/app";
import WithProvider from "@frontend/components/hocs/WithProvider";
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WithProvider context={{ theme: 'light' }}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WithProvider>
  );
}

export default MyApp;
