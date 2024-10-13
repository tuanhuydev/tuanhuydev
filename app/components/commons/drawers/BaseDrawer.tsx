import Drawer, { DrawerProps } from "@mui/material/Drawer";
import { CSSProperties } from "react";

const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0 },
};

export default function BaseDrawer({ children, open = false, onClose, ...restProps }: DrawerProps) {
  return (
    <Drawer {...restProps} style={drawerStyle} open={open} onClose={onClose}>
      {children}
    </Drawer>
  );
}
