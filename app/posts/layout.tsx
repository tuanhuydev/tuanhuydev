import GoogleAdsense from "@app/components/GoogleAdsense";
import { Fragment, PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      {children}
      <GoogleAdsense />
    </Fragment>
  );
}
