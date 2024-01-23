"use client";

import { EMPTY_OBJECT } from "@lib/configs/constants";
import React, { PropsWithChildren, useReducer } from "react";
import { createContext } from "react";

function reducer(state: ObjectType, item: ObjectType) {
  return { ...state, ...item };
}

export const AppContext = createContext(EMPTY_OBJECT);

export default function WithProvider(props: PropsWithChildren) {
  const [context, setContext] = useReducer(reducer, {
    theme: "light",
    playSound: false,
  });

  return <AppContext.Provider value={{ context, setContext }}>{props.children}</AppContext.Provider>;
}
