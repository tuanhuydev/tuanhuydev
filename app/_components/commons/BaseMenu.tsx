import { Dropdown } from "@mui/base/Dropdown";
import { Menu as MuiMenu, MenuProps as MuiMenuProps } from "@mui/base/Menu";
import { MenuButton as BaseMenuButton, MenuButtonProps as MuiMenuButtonProps } from "@mui/base/MenuButton";
import { MenuItem as MuiMenuItem, MenuItemProps as MuiMenuItemProps } from "@mui/base/MenuItem";
import MoreVert from "@mui/icons-material/MoreVert";
import clsx from "clsx";
import { forwardRef } from "react";

export interface BaseMenuItemProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  MenuItemProps?: Partial<MuiMenuItemProps>;
}

export interface BaseMenuProps extends MuiMenuProps {
  items: BaseMenuItemProps[];
  MenuProps?: Partial<MuiMenuProps>;
}

const resolveSlotProps = (fn: any, args: any) => (typeof fn === "function" ? fn(args) : fn);

export default function BaseMenu({ items, MenuProps = {} }: BaseMenuProps) {
  return (
    <Dropdown anchor="left" contentAnchor="top" {...MenuProps}>
      <MuiMenuButton>
        <MoreVert fontSize="small" />
      </MuiMenuButton>
      <MuiBaseMenu>
        {items.map((item) => (
          <BaseMenuItem key={item.label} onClick={item.onClick} {...item.MenuItemProps}>
            {item.icon && <span className="mr-2 flex items-center text-primary">{item.icon}</span>}
            {item.label}
          </BaseMenuItem>
        ))}
      </MuiBaseMenu>
    </Dropdown>
  );
}

const MuiBaseMenu = forwardRef<HTMLDivElement, MuiMenuProps>((props, ref) => {
  return (
    <MuiMenu
      ref={ref}
      {...props}
      slotProps={{
        root: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(props.slotProps?.root, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              resolvedSlotProps?.className,
              "!-left-6 rounded-md drop-shadow-md ring-1 ring-slate-700 ring-opacity-5",
            ),
          };
        },
        listbox: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(props.slotProps?.listbox, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(resolvedSlotProps?.className, "list-none p-0 m-0 bg-slate-50 rounded-md"),
          };
        },
      }}
    />
  );
});
MuiBaseMenu.displayName = "MuiMenu";

const BaseMenuItem = forwardRef<HTMLLIElement, MuiMenuItemProps>((props, ref) => {
  return (
    <MuiMenuItem
      ref={ref}
      {...props}
      slotProps={{
        root: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(props.slotProps?.root, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              resolvedSlotProps?.className,
              "flex items-center pl-2 pr-3 py-2 text-sm font-normal bg-white hover:bg-gray-100 cursor-pointer rounded-md",
            ),
          };
        },
      }}
    />
  );
});
BaseMenuItem.displayName = "BaseMenuItem";

const MuiMenuButton = forwardRef<HTMLButtonElement, MuiMenuButtonProps>((props, ref) => {
  const { className, ...other } = props;
  return (
    <BaseMenuButton
      ref={ref}
      className={clsx(
        "cursor-pointer outline-none rounded-md p-1 flex justify-center items-center gap-1 transition-all duration-300 p-1 bg-primary border-none text-slate-50 dark:bg-slate-500 dark:text-slate-200 disabled:bg-slate-200 disabled:text-slate-400",
        className,
      )}
      {...other}
    />
  );
});
MuiMenuButton.displayName = "MuiMenuButton";
