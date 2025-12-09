"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@resources/components/common/Tooltip";
import { PropsWithChildren, memo, useCallback, useEffect, useState } from "react";

export interface WithCopyProps extends PropsWithChildren {
  title?: string;
  content: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

export default memo(function WithCopy({ title = "Copy", content, children, tooltipSide = "left" }: WithCopyProps) {
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{children}</div>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
