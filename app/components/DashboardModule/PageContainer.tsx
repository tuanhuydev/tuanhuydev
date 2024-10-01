"use client";

import Navbar from "./Navbar";
import { Fragment, PropsWithChildren, ReactElement } from "react";

export interface PageContainerProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
}

export default function PageContainer({ title, goBack, children }: PageContainerProps): ReactElement<any, any> | null {
  return (
    <Fragment>
      <Navbar title={title} goBack={goBack} />
      <div className="flex flex-col h-full overflow-hidden">{children}</div>
    </Fragment>
  );
}
