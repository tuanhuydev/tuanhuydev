import Navbar from "./Navbar";
import { PropsWithChildren } from "react";

export interface PageContainerProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean | string;
}

export default function PageContainer({ title, goBack, children }: PageContainerProps) {
  const navbarProps = {
    title,
    goBack: typeof goBack === "string" ? true : goBack,
    goBackLink: typeof goBack === "string" ? goBack : undefined,
  };
  return (
    <div className="flex flex-col h-full">
      <Navbar {...navbarProps} />
      <div className="flex flex-col overflow-auto flex-grow">{children}</div>
    </div>
  );
}
