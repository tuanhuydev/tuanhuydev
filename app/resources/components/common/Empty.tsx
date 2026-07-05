import styles from "./Empty.module.css";
import { AlertCircle } from "lucide-react";
import { memo } from "react";

export interface EmptyProps {
  description?: string;
}
const Empty = memo(({ description = "No data found" }: EmptyProps) => {
  return (
    <div className={styles.empty}>
      <AlertCircle className={styles.icon} />
      {description && <p>{description}</p>}
    </div>
  );
});
Empty.displayName = "Empty";

export default Empty;
