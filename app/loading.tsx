"use client";

import Loader from "@app/components/commons/Loader";

export default function Page() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <Loader />
    </div>
  );
}
