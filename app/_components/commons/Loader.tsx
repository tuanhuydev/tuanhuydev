import React, { memo } from "react";

export default memo(function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center motion-safe:animate-spin">
      <div className="spin border-solid border-2 rounded-full w-5 h-5 border-t-transparent"></div>
    </div>
  );
});
