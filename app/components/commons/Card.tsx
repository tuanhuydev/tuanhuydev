"use client";

import BaseImage from "./BaseImage";
import { Skeleton } from "@app/components/ui/skeleton";
import React, { Fragment, PropsWithChildren } from "react";

export interface CardProps extends PropsWithChildren {
  title?: string;
  titleExtra?: React.ReactNode;
  value?: any;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  imageSrc?: string;
  hasImage?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function Card({
  className = "",
  children,
  titleExtra,
  title,
  onClick,
  icon,
  value,
  imageSrc,
  hasImage = false,
  loading = false,
}: CardProps) {
  return (
    <div
      className={`p-5 bg-white dark:bg-slate-800 rounded-md border border-solid border-slate-200 hover:border-slate-500 dark:border-transparent dark:hover:border-slate-400 cursor-pointer transition-all duration-150 ${className}`}
      onClick={onClick}>
      {hasImage && (
        <div className="relative aspect-[3/2] rounded-sm mb-3">
          <BaseImage src={imageSrc} alt="Image" fill className="rounded-md" />
        </div>
      )}
      {loading ? (
        <Skeleton className="w-full" />
      ) : (
        <Fragment>
          {title && (
            <div className="flex justify-between text-slate-600 font-bold dark:text-slate-100 text-xl mb-3">
              <span className="truncate">{title}</span> {icon} {titleExtra}
            </div>
          )}
          <div className="flex-1 flex flex-col">{value ?? children}</div>
        </Fragment>
      )}
    </div>
  );
}
