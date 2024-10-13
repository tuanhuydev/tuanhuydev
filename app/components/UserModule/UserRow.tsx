import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import Avatar from "@mui/material/Avatar";

export interface UserRowProps {
  user: ObjectType;
  active?: boolean;
}

export default function UserRow({ user, active }: UserRowProps) {
  return (
    <div className="py-3 w-full">
      <div className="flex items-center">
        <Avatar className="mr-3">
          <PersonOutlineOutlined fontSize="inherit" />
        </Avatar>
        <div className="grow flex items-center">
          <span className="text-base font-semibold capitalize w-48 text-primary dark:text-slate-400">{user.name}</span>
          <span className="text-sm text-slate-500 dark:text-slate-500">{user.email}</span>
        </div>
      </div>
    </div>
  );
}
