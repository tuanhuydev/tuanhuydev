"use client";

import BaseButton from "./buttons/BaseButton";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import React, { PropsWithChildren } from "react";

export interface BaseModalProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title?: string;
  closable?: boolean;
}

export default function BaseModal({ children, open, onClose, title, closable = false }: BaseModalProps) {
  return (
    <Modal aria-labelledby="title" aria-describedby="description" open={open} onClose={onClose} style={{ zIndex: 100 }}>
      <Fade in={open}>
        <div className="bg-white p-5 rounded-md min-w-[30rem] min-h-[15rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center mb-3 text-slate-600">
            {title && <h3 className="text-lg capitalize font-semibold m-0 grow">{title}</h3>}
            {closable && (
              <BaseButton variants="text" onClick={onClose} className="text-current" icon={<CloseOutlined />} />
            )}
          </div>
          {children}
        </div>
      </Fade>
    </Modal>
  );
}
