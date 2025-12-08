"use client";

import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import { PropsWithChildren, memo, useCallback, useEffect, useState } from "react";

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

  const copy = useCallback(
    async (e: any) => {
      e.stopPropagation();
      setTooltipContent("Copied!");
      await navigator.clipboard.writeText(content);
    },
    [content],
  );

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
