"use client";

import dynamic from "next/dynamic";
import React, { memo } from "react";

const CachedOutlined = dynamic(() => import("@mui/icons-material/CachedOutlined"), { ssr: false });
const Spin = dynamic(async () => (await import("antd/es/spin")).default, { ssr: false });

export default memo(function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spin indicator={<CachedOutlined className="!text-base" />} />
    </div>
  );
});
