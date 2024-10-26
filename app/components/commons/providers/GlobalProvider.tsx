"use client";

import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";

export const severities = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

type SnackbarConfig = {
  open: boolean;
  message: string;
  severity: (typeof severities)[keyof typeof severities];
};

export interface GlobalContextProps {
  notify: (message: SnackbarConfig["message"], severity: SnackbarConfig["severity"]) => void;
}

export const GlobalContext = createContext<null | ObjectType>(null);

const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [config, setConfig] = useState<SnackbarConfig>({
    open: false,
    message: "This is a toast",
    severity: "info",
  });

  const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setConfig((prevConfig) => ({ ...prevConfig, open: false }));
  }, []);

  const notify = useCallback((message: SnackbarConfig["message"], severity: SnackbarConfig["severity"] = "info") => {
    setConfig(() => ({ open: true, message, severity }));
  }, []);
  return (
    <GlobalContext.Provider value={{ notify }}>
      {children}
      <Snackbar open={config.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={config.severity} variant="filled" sx={{ width: "100%" }}>
          {config.message}
        </Alert>
      </Snackbar>
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within a GlobalProvider");

  return context;
};
