"use client";

import { TooltipProps } from "antd";
import dynamic from "next/dynamic";
import { PropsWithChildren, memo, useEffect, useState } from "react";

const Tooltip = dynamic(() => import("antd/es/tooltip"), { ssr: false });

export interface WithCopyProps extends PropsWithChildren {
  title?: string;
  content: string;
  TooltipProps?: Partial<TooltipProps>;
}

export default memo(function WithCopy({
  title = "Copy",
  content,
  children,
  TooltipProps = { placement: "left" },
}: WithCopyProps) {
  const [tooltipContent, setTooltipContent] = useState(title);

  const copy = async (e: any) => {
    e.stopPropagation();
    setTooltipContent("Copied!");
    await navigator.clipboard.writeText(content);
  };

  useEffect(() => {
    const tooltipTimeout = setTimeout(() => {
      if (tooltipContent === "Copied!") setTooltipContent(title);
    }, 1000);

    return () => {
      clearTimeout(tooltipTimeout);
    };
  }, [title, tooltipContent]);

  return (
    <div onClick={copy} className="cursor-pointer">
      <Tooltip {...TooltipProps} title={tooltipContent}>
        <div>{children}</div>
      </Tooltip>
    </div>
  );
});
