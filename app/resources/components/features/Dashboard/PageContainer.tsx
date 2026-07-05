import Navbar from "./Navbar";
import styles from "./PageContainer.module.css";
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
    <div className={styles.container}>
      <Navbar {...navbarProps} />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
