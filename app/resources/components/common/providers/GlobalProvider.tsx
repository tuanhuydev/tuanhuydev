"use client";

import { useToast } from "@resources/hooks/use-toast";
import { createContext, PropsWithChildren, useCallback, useContext } from "react";

export const severities = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

type ToastSeverity = (typeof severities)[keyof typeof severities] | string;

export interface GlobalContextProps {
  notify: (message: string, severity?: ToastSeverity) => void;
}

export const GlobalContext = createContext<null | GlobalContextProps>(null);

const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { toast } = useToast();

  const notify = useCallback(
    (message: string, severity: ToastSeverity = "info") => {
      toast({
        description: message,
        variant: severity === "error" ? "destructive" : "default",
      });
    },
    [toast],
  );

  return <GlobalContext.Provider value={{ notify }}>{children}</GlobalContext.Provider>;
};
export default GlobalProvider;

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within a GlobalProvider");

  return context;
};
