"use client";

import Drawer, { DrawerProps } from "@mui/material/Drawer";

export default function BaseDrawer({ children, open = false, onClose, ...restProps }: DrawerProps) {
  return (
    <Drawer
      {...restProps}
      anchor="right"
      PaperProps={{
        classes: {
          root: "w-4/5 lg:w-[40rem]",
        },
      }}
      open={open}
      onClose={onClose}>
      {children}
    </Drawer>
  );
}
