import Navbar from "./Navbar";
import { PropsWithChildren } from "react";

export interface PageContainerProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
}

export default function PageContainer({ title, goBack, children }: PageContainerProps) {
  return (
    <div className="flex flex-col h-full">
      <Navbar title={title} goBack={goBack} />
      <div className="flex flex-col overflow-auto">{children}</div>
    </div>
  );
}
