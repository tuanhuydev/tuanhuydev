import Drawer, { DrawerProps } from "antd/es/drawer";
import React, { CSSProperties } from "react";

const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0 },
};

export default function BaseDrawer({ children, open = false, onClose, ...restProps }: DrawerProps) {
  return (
    <Drawer
      {...restProps}
      size="large"
      placement="right"
      getContainer={false}
      destroyOnClose
      styles={drawerStyle}
      footer={null}
      open={open}
      onClose={onClose}>
      {children}
    </Drawer>
  );
}
