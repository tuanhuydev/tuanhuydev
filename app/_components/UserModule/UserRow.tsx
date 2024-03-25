import Loader from "../commons/Loader";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import { User } from "@prisma/client";
import dynamic from "next/dynamic";
import React from "react";

const Avatar = dynamic(() => import("antd/es/avatar"), {
  ssr: false,
  loading: () => <Loader />,
});

export interface UserRowProps {
  user: User;
  active?: boolean;
}

export default function UserRow({ user, active }: UserRowProps) {
  return (
    <div className="py-3 w-full">
      <div className="flex items-center">
        <Avatar size={24} icon={<PersonOutlineOutlined fontSize="inherit" />} className="mr-3" />
        <div className="grow flex items-center">
          <span className="text-base font-semibold capitalize w-48 text-primary dark:text-slate-400">{user.name}</span>
          <span className="text-sm text-slate-500 dark:text-slate-500">{user.email}</span>
        </div>
      </div>
    </div>
  );
}
