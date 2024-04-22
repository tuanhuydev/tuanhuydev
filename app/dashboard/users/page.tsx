"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import UserDetail from "@app/_components/UserModule/UserDetail";
import UserRow from "@app/_components/UserModule/UserRow";
import BaseDrawer from "@app/_components/commons/BaseDrawer";
import BaseInput from "@app/_components/commons/Inputs/BaseInput";
import BaseButton from "@app/_components/commons/buttons/BaseButton";
import { useUsersQuery } from "@app/queries/userQueries";
import Loader from "@components/commons/Loader";
import { ControlPointOutlined, SearchOutlined } from "@mui/icons-material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Empty } from "antd";
import { useCallback, useRef, useState } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState<ObjectType>({});
  const [selectedUser, setSelectedUser] = useState<ObjectType | undefined>(undefined);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const { data: users = [], isLoading: isUserLoading } = useUsersQuery(filter);

  // The virtualizer
  const { getTotalSize, getVirtualItems } = useVirtualizer({
    count: users?.length || 0,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 48,
  });

  const searchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const search = e.target.value;
      setFilter((currentFilter) => ({ ...currentFilter, search }));
    }, 500);
  };

  const createUser = () => {
    setSelectedUser(undefined);
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setSelectedUser(undefined);
    setOpenDrawer(false);
  };

  const viewUser = (user: ObjectType) => () => {
    setSelectedUser(user);
    setOpenDrawer(true);
  };

  const RenderUsers = useCallback(() => {
    if (!users.length && !isUserLoading) return <Empty description="No users found" />;
    if (isUserLoading) return <Loader />;
    return (
      <div className="w-full mt-3 relative" style={{ height: `${getTotalSize()}px` }}>
        {getVirtualItems().map((virtualItem) => {
          const currentUser: ObjectType = users[virtualItem.index];
          const activeUser = selectedUser?.id === currentUser.id;
          return (
            <div
              key={currentUser.id}
              onClick={viewUser(currentUser)}
              className={`absolute top-0 left-0 flex items-center w-full p-3 ${
                activeUser
                  ? "bg-slate-200 hover:bg-slate-200 dark:bg-slate-800"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              } rounded-md cursor-pointer transition-all duration-100 ease-in-out`}
              style={{ height: `${virtualItem.size}px`, transform: `translateY(${virtualItem.start}px)` }}>
              <UserRow user={currentUser} active={activeUser} />
            </div>
          );
        })}
      </div>
    );
  }, [users, isUserLoading, selectedUser, getTotalSize, getVirtualItems]);

  return (
    <PageContainer title="Users">
      <div data-testid="dashboard-posts-page-testid" className="mb-3 gap-2 flex items-center">
        <BaseInput
          startAdornment={<SearchOutlined className="!text-lg" />}
          placeholder="Find your user"
          onChange={searchUser}
          className="grow mr-2 rounded-sm"
        />
        <div>
          <BaseButton label="New User" icon={<ControlPointOutlined fontSize="small" />} onClick={createUser} />
        </div>
      </div>
      <div className="grow overflow-auto" ref={containerRef}>
        {RenderUsers()}
        <BaseDrawer open={openDrawer} onClose={closeDrawer}>
          <UserDetail user={selectedUser} onClose={closeDrawer} />
        </BaseDrawer>
      </div>
    </PageContainer>
  );
}
