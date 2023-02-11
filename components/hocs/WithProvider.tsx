import React, { useState } from "react";
import { createContext } from "react";
import { EMPTY_OBJECT } from "../../configs/contanst";
import { ComponentProps } from "../../interfaces/base";

export interface ProviderProps extends ComponentProps {
  context: any;
}

export const AppContext = createContext(EMPTY_OBJECT);

export default function WithProvider(props: ProviderProps) {
  const [context, setContext] = useState(props.context);

  return (
    <AppContext.Provider value={{ context, setContext }}>
      {props?.children}
    </AppContext.Provider>
  );
}
