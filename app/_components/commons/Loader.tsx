"use client";

import React, { memo } from "react";

export default memo(function Loader() {
  return (
    <div className="motion-safe:animate-spin w-5 h-5">
      <div className="spin border-solid border-2 rounded-full w-5 h-5 border-t-transparent"></div>
    </div>
  );
});
