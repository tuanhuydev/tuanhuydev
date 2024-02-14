"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function TestComponent() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    staleTime: 3000,
    queryFn: () => {
      return fetch("https://jsonplaceholder.typicode.com/posts").then((res) => res.json());
    },
  });
  console.log(posts);

  if (isLoading) return <div>Loading...</div>;
  return posts?.map((post: any) => <div key={post.id}>{post.title}</div>);
}
