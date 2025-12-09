"use client";

import { Drawer, DrawerContent, DrawerTitle } from "@app/components/ui/drawer";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { ReactNode } from "react";

export interface BaseDrawerProps {
  children: ReactNode;
  open?: boolean;
  onClose?: () => void;
  side?: "bottom" | "right" | "left" | "top";
  className?: string;
  title?: string;
}

export default function BaseDrawer({
  children,
  open = false,
  onClose,
  side = "right",
  className = "w-full sm:w-[500px] md:w-[600px] lg:w-[700px] sm:m-2 sm:mr-2 sm:rounded-lg",
  title = "Drawer",
}: BaseDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DrawerContent side={side} className={className}>
        <VisuallyHidden>
          <DrawerTitle>{title}</DrawerTitle>
        </VisuallyHidden>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
