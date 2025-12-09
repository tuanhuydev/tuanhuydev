"use client";

import Empty from "@resources/components/common/Empty";
import { ErrorBoundary } from "@resources/components/common/ErrorBoundary";
import Loader from "@resources/components/common/Loader";
import PageFilter from "@resources/components/common/PageFilter";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { useDebounce } from "@resources/hooks/useDebounce";
import { useCurrentUserPermission } from "@resources/queries/permissionQueries";
import { useUsersQuery } from "@resources/queries/userQueries";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChangeEvent, Suspense, lazy, useCallback, useRef, useState } from "react";

// Replace dynamic imports with React lazy
const UserDetail = lazy(() => import("@resources/components/features/User/UserDetail"));
const BaseDrawer = lazy(() => import("@resources/components/common/drawers/BaseDrawer"));
const UserRow = lazy(() => import("@resources/components/features/User/UserRow"));

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
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<ObjectType | undefined>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // Hooks
  const { data: users = [], isFetching, refetch } = useUsersQuery(filter);

  const { getTotalSize, getVirtualItems } = useVirtualizer({
    count: (users as Array<ObjectType>).length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => estimateSize, []),
  });

  const performSearch = useCallback(
    (search: string) => {
      setFilter((prevFilter) => {
        if (search?.length) return { ...prevFilter, search };
        const { search: _, ...rest } = prevFilter;
        return rest;
      });
      refetch();
    },
    [refetch],
  );

  const debouncedSearch = useDebounce(performSearch, 500);

  const onSearchUsers = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      setSearchValue(search);
      debouncedSearch(search);
    },
    [debouncedSearch],
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

  const totalSize = getTotalSize();

  // Use a function component instead of useMemo
  const RenderUsers = () => {
    if (!users.length && !isFetching) return <Empty description="No users found" />;
    if (isFetching) return <Loader />;
    return (
      <div className="w-full mt-3 relative" style={{ height: `${totalSize}px` }}>
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
  };

  return (
    <PageContainer title="Users">
      <PageFilter
        onSearch={onSearchUsers}
        onNew={createUser}
        searchPlaceholder="Find your user"
        createLabel="New User"
        allowCreate={allowCreateUser}
        value={searchValue}
      />
      <div className="grow overflow-auto h-full" ref={containerRef}>
        <RenderUsers />
      </div>

      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <BaseDrawer open={openDrawer} onClose={closeDrawer}>
            <UserDetail user={selectedUser} onClose={closeDrawer} />
          </BaseDrawer>
        </Suspense>
      </ErrorBoundary>
    </PageContainer>
  );
}
