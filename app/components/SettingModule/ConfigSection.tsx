import React, { PropsWithChildren, memo } from "react";

export interface ConfigSectionProps extends PropsWithChildren {
  title: string;
  description?: string;
  extra?: React.ReactNode;
}

export default memo(function ConfigSection({ title, description, children, extra }: ConfigSectionProps) {
  return (
    <div className="flex flex-col mb-5">
      <div className="flex justify-between">
        <h4 className="text-base mt-0 mb-1 font-medium text-slate-700 dark:text-slate-300">{title}</h4>
        {extra}
      </div>
      {description && <p className="text-xs mt-0 mb-3 text-gray-400 dark:text-gray-500">{description}</p>}
      {children}
    </div>
  );
});
