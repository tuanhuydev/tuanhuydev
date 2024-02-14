import { Skeleton } from "antd";
import React, { Fragment, PropsWithChildren } from "react";

export interface CardProps extends PropsWithChildren {
  title?: string;
  value?: any;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function Card({ className = "", children, title, icon, value, loading = false }: CardProps) {
  return (
    <div
      className={`p-5 bg-white dark:bg-slate-700 rounded-md border border-solid border-slate-200 hover:border-primary dark:border-transparent dark:hover:border-slate-400 ${className}`}>
      {loading ? (
        <Fragment>
          <Skeleton />
        </Fragment>
      ) : (
        <Fragment>
          {title && (
            <div className="flex justify-between font-base text-slate-400 dark:text-slate-100 text-xl mb-3">
              {title} {icon}
            </div>
          )}
          <div className="card-content text-3xl text-primary dark:text-white">{value ?? children}</div>
        </Fragment>
      )}
    </div>
  );
}
