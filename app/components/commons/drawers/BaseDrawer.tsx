import Drawer, { DrawerProps } from "@mui/material/Drawer";
import { CSSProperties } from "react";

const drawerStyle: { [key: string]: CSSProperties } = {
  header: { display: "none" },
  body: { padding: 0 },
};

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
