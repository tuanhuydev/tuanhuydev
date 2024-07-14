"use client";

import { DRAWER_MODE } from ".";
import BaseButton from "@components/commons/buttons/BaseButton";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import EditOffOutlined from "@mui/icons-material/EditOffOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { Fragment, useCallback, useMemo } from "react";

export interface BaseDrawerHeaderProps {
  title?: string;
  mode: DRAWER_MODE;
  editable?: boolean;
  ExtraHeader?: React.ReactNode;
  onClose: (open: boolean) => void;
  onToggle: (mode: string) => void;
}

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
  const RenderHeaderExtra = useMemo(() => {
    return (
      <div className="px-2 flex gap-2 items-center relative">
        {editable && (
          <Fragment>
            {isViewMode && (
              <BaseButton
                onClick={toggleMode(DRAWER_MODE.EDIT)}
                icon={<EditOutlined className="text-slate-50" fontSize="small" />}
              />
            )}
            {isEditMode && (
              <BaseButton
                onClick={toggleMode(DRAWER_MODE.VIEW)}
                icon={<EditOffOutlined className=" text-slate-50" fontSize="small" />}
              />
            )}
          </Fragment>
        )}
        {ExtraHeader}
        <BaseButton onClick={handleClose} icon={<CloseOutlined className="text-slate-50" fontSize="small" />} />
      </div>
    );
  }, [ExtraHeader, editable, handleClose, isEditMode, isViewMode, toggleMode]);

  return (
    <div className="bg-slate-700 mb-3 flex justify-between shadow-md">
      <h1 className="my-0 mr-3 px-3 py-2 bg-primary text-white text-base">{title}</h1>
      {RenderHeaderExtra}
    </div>
  );
}
