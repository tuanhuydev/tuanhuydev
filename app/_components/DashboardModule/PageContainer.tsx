import WithTransition from "../commons/hocs/WithTransition";
import Navbar from "./Navbar";
import React, { Fragment, PropsWithChildren, ReactElement } from "react";

export interface PageContainerProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
}

export default function PageContainer({ title, goBack, children }: PageContainerProps): ReactElement<any, any> | null {
  return (
    <Fragment>
      <Navbar title={title} goBack={goBack} />
      <div className="h-full overflow-auto p-3 drop-shadow-lg bg-slate-50 dark:bg-gray-950">
        <WithTransition>{children}</WithTransition>
      </div>
    </Fragment>
  );
}
