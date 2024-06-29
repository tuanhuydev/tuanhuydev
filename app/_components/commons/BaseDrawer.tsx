import Drawer, { DrawerProps } from "antd/es/drawer";
import React, { CSSProperties } from "react";

export default function BaseDrawer({ children, open = false, onClose }: DrawerProps) {
  return (
    <Drawer size="large" placement="right" footer={null} getContainer={false} open={open} onClose={onClose}>
      {children}
    </Drawer>
  );
}
