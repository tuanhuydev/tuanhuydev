"use client";

import { Button } from "@resources/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@resources/components/common/DropdownMenu";
import { MoreVertical } from "lucide-react";
import { memo } from "react";

export interface BaseMenuItemV2Props {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MenuProps {
  items: BaseMenuItemV2Props[];
  triggerIcon?: React.ReactNode;
  disabled?: boolean;
}

const Menu = memo(function Menu({ items, triggerIcon, disabled = false }: MenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled}
          size="icon"
          variant="ghost"
          className="h-8 w-8 bg-primary text-white hover:bg-primary/80 disabled:bg-slate-300 disabled:text-slate-500">
          {triggerIcon || <MoreVertical className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={`${item.label}-${index}`}
            onClick={item.onClick}
            disabled={item.disabled}
            className="cursor-pointer">
            {item.icon && <span className="mr-2 flex items-center">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default Menu;
