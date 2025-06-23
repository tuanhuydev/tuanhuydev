"use client";

import { DRAWER_MODE } from ".";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { SxProps, Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Fragment, useCallback } from "react";

export interface BaseDrawerHeaderProps {
  title?: string;
  mode: DRAWER_MODE;
  editable?: boolean;
  ExtraHeader?: React.ReactNode;
  onClose: (open: boolean) => void;
  onToggle: (mode: string) => void;
}

const IconButtonStyles: SxProps<Theme> = {
  backgroundColor: "primary.main",
  borderRadius: "25%",
  "&:hover": {
    backgroundColor: "primary.dark",
  },
};

export default function BaseDrawerHeader({
  mode,
  title,
  editable = false,
  onClose,
  onToggle,
  ExtraHeader = <Fragment />,
}: BaseDrawerHeaderProps) {
  const isViewMode = mode === DRAWER_MODE.VIEW;
  const isEditMode = mode === DRAWER_MODE.EDIT;

  const toggleMode = useCallback(
    (mode: string) => () => {
      onToggle(mode as DRAWER_MODE);
    },
    [onToggle],
  );

  const handleClose = useCallback(() => onClose(false), [onClose]);

  return (
    <div className="bg-slate-700 mb-3 flex justify-between shadow-md">
      <h1 className="my-0 mr-3 px-3 py-2 bg-primary text-white text-base">{title}</h1>
      <div className="px-2 flex gap-2 items-center relative">
        {editable && (
          <Fragment>
            {isViewMode && (
              <IconButton sx={IconButtonStyles} size="small" onClick={toggleMode(DRAWER_MODE.EDIT)}>
                <EditOutlined className="text-slate-50" />
              </IconButton>
            )}
            {isEditMode && (
              <IconButton size="small" sx={IconButtonStyles} onClick={toggleMode(DRAWER_MODE.VIEW)} color="primary">
                <EditOffOutlined className="text-slate-50" />
              </IconButton>
            )}
          </Fragment>
        )}
        {ExtraHeader}
        <IconButton size="small" sx={IconButtonStyles} onClick={handleClose} color="primary">
          <CloseOutlined className="text-slate-50" />
        </IconButton>
      </div>
    </div>
  );
}
