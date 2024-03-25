import Drawer, { DrawerProps } from "antd/es/drawer";
import React, { CSSProperties } from "react";

const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0, background: "theme.colors.primary" },
};

export default function BaseDrawer({ children, open = false, onClose }: DrawerProps) {
  return (
    <Drawer
      size="large"
      placement="right"
      footer={null}
      getContainer={false}
      destroyOnClose
      styles={drawerStyle}
      open={open}
      onClose={onClose}>
      {children}
    </Drawer>
  );
}
