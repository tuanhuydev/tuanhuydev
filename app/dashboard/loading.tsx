"use client";

import Loader from "@components/commons/Loader";
import React from "react";

export default function Page() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <Loader />
    </div>
  );
}
