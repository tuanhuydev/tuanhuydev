import { Textarea } from "@app/components/ui/textarea";
import { cn } from "@app/lib/utils";
import React from "react";

const BaseTextarea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => {
  const { className = "", value, ...restProps } = props;

  return <Textarea ref={ref} className={cn("min-h-[100px]", className)} {...restProps} />;
});

BaseTextarea.displayName = "BaseTextarea";

export default BaseTextarea;
