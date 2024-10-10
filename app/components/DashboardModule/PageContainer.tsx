import Navbar from "./Navbar";
import { Fragment, PropsWithChildren } from "react";

export interface PageContainerProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
}

export default function PageContainer({ title, goBack, children }: PageContainerProps) {
  return (
    <Fragment>
      <Navbar title={title} goBack={goBack} />
      <div className="flex flex-col h-full">{children}</div>
    </Fragment>
  );
}
