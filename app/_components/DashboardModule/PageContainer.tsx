"use client";

import Loader from "@components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import dynamic from "next/dynamic";
import React, { PropsWithChildren, ReactElement, useState } from "react";

const Navbar = dynamic(() => import("./Navbar"), { ssr: false });
const WithAnimation = dynamic(() => import("@components/hocs/WithAnimation"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function PageContainer({ children, ...restProps }: PropsWithChildren): ReactElement<any, any> | null {
  const [goBack, setGoBack] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(EMPTY_STRING);

  const enhancedComponent = React.Children.map(children, (child) => {
    return React.cloneElement(child as ReactElement<any>, { ...restProps, setTitle, setGoBack });
  });

  return (
    <div className="grow flex flex-col z-2">
      <Navbar title={title} goBack={goBack} />
      <div className="h-full overflow-auto p-3 bg-slate-50 dark:bg-slate-700 drop-shadow-lg">
        <WithAnimation>{enhancedComponent}</WithAnimation>
      </div>
    </div>
  );
}
