import BaseImage from "./BaseImage";
import { Skeleton } from "antd";
import Image from "next/image";
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
      className={`p-5 bg-white dark:bg-slate-700 rounded-md border border-solid border-slate-200 hover:border-primary dark:border-transparent dark:hover:border-slate-400 cursor-pointer transition-all duration-150 ${className}`}
      onClick={onClick}>
      {hasImage && (
        <div className="relative aspect-[3/2] rounded-sm mb-3">
          <BaseImage src={imageSrc} alt="Image" fill />
        </div>
      )}
      {loading ? (
        <Fragment>
          <Skeleton />
        </Fragment>
      ) : (
        <Fragment>
          {title && (
            <div className="flex justify-between font-base text-slate-600 font-medium dark:text-slate-100 text-xl mb-3">
              {title} {icon} {titleExtra}
            </div>
          )}
          <div className="card-content text-3xl text-primary dark:text-white">{value ?? children}</div>
        </Fragment>
      )}
    </div>
  );
}
