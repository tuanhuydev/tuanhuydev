"use client";

import { currentUserSelector } from "@lib/store/slices/authSlice";
import { Resource } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Navbar = dynamic(() => import("./Navbar"), { ssr: false });
const Loader = dynamic(() => import("@lib/components/commons/Loader").then((module) => module.default), { ssr: false });
const WithAnimation = dynamic(() => import("@lib/components/hocs/WithAnimation"), { ssr: false });

export interface PageContainerProps extends PropsWithChildren {
  title?: string;
  pageKey: string;
  goBack?: boolean;
  loading?: boolean;
}

const DEFAULT_PAGES = ["Home", "Setting"];

export default function PageContainer(props: PageContainerProps): ReactElement<any, any> | null {
  const { children, title, pageKey, goBack, loading = true, ...restProps } = props;
  const [pageLoading, setPageLoading] = useState<boolean>(loading);

  const router = useRouter();
  const { resources = [] } = useSelector(currentUserSelector) || {};

  useEffect(() => {
    const allowAccess = resources.has(pageKey);
    const isDefaultFeature = DEFAULT_PAGES.includes(pageKey);
    if (isDefaultFeature || allowAccess) {
      setPageLoading(false);
      return;
    }

    router.back();
  }, [pageKey, resources, router]);
  if (pageLoading) return <Loader />;

  return (
    <div className="grow flex flex-col z-2">
      <Navbar title={title} goBack={goBack} />
      <div className="h-full overflow-auto p-3 bg-white drop-shadow-lg">
        <WithAnimation>{children}</WithAnimation>
      </div>
    </div>
  );
}
