"use client";

import { useCurrentUserPermission } from "@app/_queries/permissionQueries";
import { useUsersQuery } from "@app/_queries/userQueries";
import PageContainer from "@app/components/DashboardModule/PageContainer";
import Empty from "@app/components/commons/Empty";
import Loader from "@app/components/commons/Loader";
import PageFilter from "@app/components/commons/PageFilter";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChangeEvent, Suspense, lazy, useCallback, useRef, useState } from "react";

// Replace dynamic imports with React lazy
const UserDetail = lazy(() => import("@app/components/UserModule/UserDetail"));
const BaseDrawer = lazy(() => import("@app/components/commons/drawers/BaseDrawer"));
const UserRow = lazy(() => import("@app/components/UserModule/UserRow"));

export type RecordMode = "VIEW" | "EDIT";
const estimateSize = 48;

export default function Page() {
  const { data: permissions = [] } = useCurrentUserPermission();

  const allowCreateUser = (permissions as Array<ObjectType>).some((permission: ObjectType = {}) => {
    const { action = "", resourceId = "", type = "" } = permission;
    return action === "create" && type === "user" && resourceId === "*";
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  // State
  const [filter, setFilter] = useState<ObjectType>({});
  const [selectedUser, setSelectedUser] = useState<ObjectType | undefined>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // Hooks
  const { data: users = [], isFetching, refetch } = useUsersQuery(filter);

  const { getTotalSize, getVirtualItems } = useVirtualizer({
    count: (users as Array<ObjectType>).length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => estimateSize, []),
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

  const createUser = useCallback(() => {
    setSelectedUser(undefined);
    setOpenDrawer(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setSelectedUser(undefined);
    setOpenDrawer(false);
  }, []);

  const viewUser = useCallback(
    (user: ObjectType) => () => {
      setSelectedUser(user);
      setOpenDrawer(true);
    },
    [],
  );

  const RenderUsers = useCallback(() => {
    if (!users.length && !isFetching) return <Empty description="No users found" />;
    if (isFetching) return <Loader />;
    return (
      <div className="w-full mt-3 relative" style={{ height: `${getTotalSize()}px` }}>
        {getVirtualItems().map(({ index, size, start }) => {
          const currentUser: ObjectType = users[index];
          const activeUser = selectedUser?.id === currentUser.id;
          const userClasses = activeUser
            ? "bg-slate-200 hover:bg-slate-200 dark:bg-slate-800"
            : "hover:bg-slate-100 dark:hover:bg-slate-800";

          return (
            <div
              key={currentUser.id}
              onClick={viewUser(currentUser)}
              className={`absolute top-0 left-0 flex items-center w-full p-3 ${userClasses} rounded-md cursor-pointer transition-all duration-100 ease-in-out`}
              style={{ height: `${size}px`, transform: `translateY(${start}px)` }}>
              <UserRow user={currentUser} active={activeUser} />
            </div>
          );
        })}
      </div>
    );
  }, [getTotalSize, getVirtualItems, isFetching, selectedUser, users, viewUser]);

  return (
    <PageContainer title="Users">
      <PageFilter
        onSearch={onSearchUsers}
        onNew={createUser}
        searchPlaceholder="Find your user"
        createLabel="New User"
        allowCreate={allowCreateUser}
      />
      <div className="grow overflow-auto" ref={containerRef}>
        {RenderUsers()}
      </div>

      <Suspense fallback={<Loader />}>
        <BaseDrawer open={openDrawer} onClose={closeDrawer}>
          <UserDetail user={selectedUser} onClose={closeDrawer} />
        </BaseDrawer>
      </Suspense>
    </PageContainer>
  );
}
