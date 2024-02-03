"use client";

import Loader from "@components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import dynamic from "next/dynamic";
import React, { Fragment, PropsWithChildren, ReactElement, useEffect, useState } from "react";

const Navbar = dynamic(() => import("./Navbar"), { ssr: false, loading: () => <Loader /> });
const WithAnimation = dynamic(() => import("@app/_components/commons/hocs/WithAnimation"), {
  ssr: false,
  loading: () => <Loader />,
});
type EnhancedProps = {
  [key: string]: any;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setGoBack: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface PageContainerProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
}

export default function PageContainer({
  title: containerTitle,
  goBack: containerGoBack = false,
  children,
  ...restProps
}: PageContainerProps): ReactElement<any, any> | null {
  const [goBack, setGoBack] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(EMPTY_STRING);

  useEffect(() => {
    if (containerTitle) setTitle(containerTitle);
    if (containerGoBack) setGoBack(containerGoBack);
  }, [containerTitle, containerGoBack]);

  const enhancedComponent = React.Children.map(children, (child) => {
    return React.cloneElement(child as ReactElement<any>, { ...restProps, setTitle, setGoBack } as EnhancedProps);
  });

  return (
    <Fragment>
      <Navbar title={title} goBack={goBack} />
      <div className="h-full overflow-auto p-3 drop-shadow-lg bg-slate-50 dark:bg-gray-950">
        <WithAnimation>{enhancedComponent}</WithAnimation>
      </div>
    </Fragment>
  );
}
