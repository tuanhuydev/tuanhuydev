import { User } from "@lib/types/user";
import { Avatar, AvatarFallback } from "@resources/components/common/Avatar";
import { User as UserIcon } from "lucide-react";
import { memo } from "react";

export interface UserRowProps {
  user: User;
  active?: boolean;
}

const UserRow = memo(function UserRow({ user }: UserRowProps) {
  return (
    <div className="py-3 w-full">
      <div className="flex items-center">
        <Avatar className="mr-3">
          <AvatarFallback>
            <UserIcon className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        <div className="grow flex items-center">
          <span className="text-base font-semibold capitalize w-48 text-primary dark:text-slate-400">{user.name}</span>
          <span className="text-sm text-slate-500 dark:text-slate-500">{user.email}</span>
        </div>
      </div>
    </div>
  );
});

UserRow.displayName = "UserRow";
export default UserRow;
