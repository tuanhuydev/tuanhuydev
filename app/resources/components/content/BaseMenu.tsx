import { Button } from "@resources/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@resources/components/common/DropdownMenu";
import { MoreVertical } from "lucide-react";

export interface BaseMenuItemProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface BaseMenuProps {
  items: BaseMenuItemProps[];
}

export default function BaseMenu({ items }: BaseMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="icon" className="w-8 h-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem key={item.label} onClick={item.onClick}>
            {item.icon && <span className="mr-2 flex items-center">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
