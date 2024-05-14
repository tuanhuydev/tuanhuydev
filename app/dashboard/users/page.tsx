"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import UserDetail from "@app/_components/UserModule/UserDetail";
import UserRow from "@app/_components/UserModule/UserRow";
import BaseDrawer from "@app/_components/commons/BaseDrawer";
import PageFilter from "@app/_components/commons/PageFilter";
import { useUsersQuery } from "@app/queries/userQueries";
import Loader from "@components/commons/Loader";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Empty } from "antd";
import { ChangeEvent, useCallback, useRef, useState } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState<ObjectType>({});
  const [selectedUser, setSelectedUser] = useState<ObjectType | undefined>(undefined);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const { data: users = [], isLoading: isUserLoading, refetch } = useUsersQuery(filter);

  // The virtualizer
  const { getTotalSize, getVirtualItems } = useVirtualizer({
    count: users?.length || 0,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 48,
  });

  const onSearchUsers = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTimeout(() => {
        const search = event.target.value;
        setFilter((prevFilter) => {
          if (search?.length) return { ...prevFilter, search };
          delete prevFilter?.search;
          return prevFilter;
        });
        refetch();
      }, 500);
    },
    [refetch],
  );

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
      <PageFilter
        onSearch={onSearchUsers}
        onNew={createUser}
        searchPlaceholder="Find your project"
        createLabel="New project"
      />
      <div className="grow overflow-auto" ref={containerRef}>
        {RenderUsers()}
        <BaseDrawer open={openDrawer} onClose={closeDrawer}>
          <UserDetail user={selectedUser} onClose={closeDrawer} />
        </BaseDrawer>
      </div>
    </PageContainer>
  );
}
