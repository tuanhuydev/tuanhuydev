import BrowserNotSupportedOutlinedIcon from "@mui/icons-material/BrowserNotSupportedOutlined";
import { memo } from "react";

export interface EmptyProps {
  description?: string;
}
const Empty = memo(({ description = "No data found" }: EmptyProps) => {
  return (
    <div className="flex flex-col my-4 text-gray-400 items-center justify-center h-full">
      <BrowserNotSupportedOutlinedIcon />
      {description && <p className="">{description}</p>}
    </div>
  );
});
Empty.displayName = "Empty";

export default Empty;
