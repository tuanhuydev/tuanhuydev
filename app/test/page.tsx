import getQueryClient from "../_configs/queryClient";
import TestComponent from "./TestComponent";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default async function Page() {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      <TestComponent />
    </HydrationBoundary>
  );
}
