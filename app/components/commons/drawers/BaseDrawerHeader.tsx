"use client";

import { DRAWER_MODE } from ".";
import { Button } from "@app/components/ui/button";
import { Edit, Edit2, X } from "lucide-react";
import { Fragment, useCallback } from "react";

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

  return (
    <div className="bg-background border-b mb-3 flex justify-between shadow-md">
      <h1 className="my-0 mr-3 px-3 py-2 text-foreground text-base font-semibold">{title}</h1>
      <div className="px-2 flex gap-2 items-center relative">
        {editable && (
          <Fragment>
            {isViewMode && (
              <Button size="icon" variant="default" onClick={toggleMode(DRAWER_MODE.EDIT)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {isEditMode && (
              <Button size="icon" variant="default" onClick={toggleMode(DRAWER_MODE.VIEW)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </Fragment>
        )}
        {ExtraHeader}
        <Button size="icon" variant="default" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
