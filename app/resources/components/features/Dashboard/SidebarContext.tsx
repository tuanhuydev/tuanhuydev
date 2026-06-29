"use client";

import { createContext, useContext, useState, PropsWithChildren } from "react";

interface SidebarContextValue {
  mobileOpen: boolean;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({ mobileOpen: false, toggleMobile: () => {} });

export function SidebarProvider({ children }: PropsWithChildren) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ mobileOpen, toggleMobile: () => setMobileOpen((p) => !p) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
