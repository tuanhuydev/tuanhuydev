import TestComponent from "./TestComponent";
import getQueryClient from "./queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default async function Page() {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      <TestComponent />
    </HydrationBoundary>
  );
}
