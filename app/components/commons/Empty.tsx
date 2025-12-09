import { AlertCircle } from "lucide-react";
import { memo } from "react";

export interface EmptyProps {
  description?: string;
}
const Empty = memo(({ description = "No data found" }: EmptyProps) => {
  return (
    <div className="flex flex-col my-4 text-gray-400 dark:text-gray-500 items-center justify-center h-full">
      <AlertCircle className="w-6 h-6" />
      {description && <p className="">{description}</p>}
    </div>
  );
});
Empty.displayName = "Empty";

export default Empty;
