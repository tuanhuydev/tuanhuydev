"use client";

import MoreVert from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, IconButton, MenuProps as MuiMenuProps } from "@mui/material";
import { useState, memo } from "react";

export interface BaseMenuItemV2Props {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BaseMenuV2Props {
  items: BaseMenuItemV2Props[];
  MenuProps?: Partial<MuiMenuProps>;
  triggerIcon?: React.ReactNode;
  disabled?: boolean;
}

const BaseMenuV2 = memo(function BaseMenuV2({ items, MenuProps = {}, triggerIcon, disabled = false }: BaseMenuV2Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (itemOnClick: () => void) => () => {
    itemOnClick();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        sx={{
          padding: "0.25rem",
          backgroundColor: "var(--color-primary, #172733)",
          color: "white",
          borderRadius: "0.375rem",
          "&:hover": {
            backgroundColor: "rgba(23, 39, 51, 0.8)",
          },
          "&.Mui-disabled": {
            backgroundcolor: "rgb(203, 213, 225)",
            color: "rgb(148 163 184)",
          },
        }}>
        {triggerIcon || <MoreVert fontSize="small" />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        {...MenuProps}
        slotProps={{
          paper: {
            ...MenuProps.slotProps?.paper,
            sx: {
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              border: "1px solid rgb(226 232 240)",
              mt: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        {items.map((item, index) => (
          <MenuItem
            key={`${item.label}-${index}`}
            onClick={handleItemClick(item.onClick)}
            disabled={item.disabled}
            sx={{
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem",
              minHeight: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              "&:hover": {
                backgroundColor: "rgb(241 245 249)",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
              },
            }}>
            {item.icon && <span className="flex items-center text-primary dark:text-slate-50">{item.icon}</span>}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

export default BaseMenuV2;
