"use client";

import Loader from "@components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import dynamic from "next/dynamic";
import React, { Fragment, PropsWithChildren, ReactElement, useState } from "react";

const Navbar = dynamic(() => import("./Navbar"), { ssr: false, loading: () => <Loader /> });
const WithAnimation = dynamic(() => import("@components/hocs/WithAnimation"), {
  ssr: false,
  loading: () => <Loader />,
});
type EnhancedProps = {
  [key: string]: any;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setGoBack: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PageContainer({ children, ...restProps }: PropsWithChildren): ReactElement<any, any> | null {
  const [goBack, setGoBack] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(EMPTY_STRING);

  const enhancedComponent = React.Children.map(children, (child) => {
    return React.cloneElement(child as ReactElement<any>, { ...restProps, setTitle, setGoBack } as EnhancedProps);
  });

  return (
    <Fragment>
      <Navbar title={title} goBack={goBack} />
      <div className="h-full overflow-auto p-3 bg-slate-50 dark:bg-slate-700 drop-shadow-lg">
        <WithAnimation>{enhancedComponent}</WithAnimation>
      </div>
    </Fragment>
  );
}
