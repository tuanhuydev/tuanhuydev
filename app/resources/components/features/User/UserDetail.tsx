"use client";

import { DRAWER_MODE } from "@resources/components/common/drawers";
import BaseDrawerHeader from "@resources/components/common/drawers/BaseDrawerHeader";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import { useCreateUser, useUpdateUserDetail } from "@resources/queries/userQueries";
import { useEffect, useState } from "react";

export interface UserDetailProps {
  user?: Record<string, unknown>;
  onClose: () => void;
}

// const revertTableUserPermissions = (tableUserPermissions: unknown[]) => {
//   const revertedUserPermissions: unknown[] = [];
//   const permissionIds: number[] = [];

//   tableUserPermissions.forEach((permission: unknown) => {
//     const { permissionId, action, resourceId, type } = permission;
//     if (!permissionIds.includes(permissionId)) {
//       permissionIds.push(permissionId);
//       revertedUserPermissions.push({
//         id: permissionId,
//         rules: [{ action, resourceId, type }],
//       });
//     } else {
//       const existingPermission = revertedUserPermissions.find((p) => p.id === permissionId);
//       if (existingPermission) {
//         existingPermission.rules.push({ action, resourceId, type });
//       }
//     }
//   });

//   return revertedUserPermissions;
// };

export default function UserDetail({ user, onClose }: UserDetailProps) {
  // State
  const [mode, setMode] = useState<DRAWER_MODE>(DRAWER_MODE.VIEW);

  // Hooks
  const { notify } = useGlobal();
  const { isSuccess: createdUserSuccess } = useCreateUser();
  const { isSuccess: updateUserSuccess } = useUpdateUserDetail();

  // Map user permissions to table format
  // const tableUserPermissions = userPermissions.flatMap(({ id, rules }: unknown) => {
  //   return rules.map(({ action, resourceId, type }: unknown) => ({
  //     permissionId: id,
  //     action,
  //     resourceId,
  //     type,
  //   }));
  // });

  const isViewMode = mode === DRAWER_MODE.VIEW;
  const editable = !!user;
  const title = isViewMode && user ? "User Detail" : !user ? "Create new user" : "Edit User";

  useEffect(() => {
    if (!user) setMode(DRAWER_MODE.EDIT);
  }, [user]);

  useEffect(() => {
    if (createdUserSuccess || updateUserSuccess) {
      notify("User saved successfully", "success");
    }
  }, [createdUserSuccess, notify, updateUserSuccess]);

  // useEffect(() => {
  //   if (user?.id) refetchUserPermission();
  // }, [refetchUserPermission, user?.id]);

  // const DrawerContent = useMemo(() => {
  //   if (mode === DRAWER_MODE.VIEW) {
  //     return (
  //       <div className="w-full h-full flex flex-col">
  //         <div className="px-3 pt-3 pb-2 shrink-0">
  //           <div className="flex gap-4">
  //             <Avatar className="w-18 h-18 shrink-0">
  //               <AvatarFallback>
  //                 <User className="h-8 w-8" />
  //               </AvatarFallback>
  //             </Avatar>
  //             <div className="my-5">
  //               <h2 className="text-2xl m-0 mb-1 text-gray-900 dark:text-gray-100">{user?.name}</h2>
  //               <h4 className="m-0 font-normal text-slate-400 dark:text-slate-500">{user?.email}</h4>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="flex-1 overflow-y-auto px-3">
  //           <div className="grid grid-cols-6 gap-5 mb-5">
  //             <div className="flex gap-4 col-span-3 pb-3 border-b border-gray-200 dark:border-gray-700">
  //               <label className="font-normal text-slate-400 dark:text-slate-500">Project:</label>
  //               <span className="text-foreground">Project</span>
  //             </div>
  //             <div className="flex gap-4 col-span-3 pb-3 border-b border-gray-200 dark:border-gray-700">
  //               <label className="font-normal text-slate-400 dark:text-slate-500">Role:</label>
  //               <span className="text-foreground">Field project</span>
  //             </div>
  //             <div className="flex gap-4 col-span-3 pb-3 border-b border-gray-200 dark:border-gray-700">
  //               <label className="font-normal text-slate-400 dark:text-slate-500">Status:</label>
  //               <span className="text-foreground">Field status</span>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="px-3 pb-3 shrink-0 border-t pt-3">
  //           <div className="flex gap-4">
  //             <label className="font-normal text-slate-400 dark:text-slate-500">Created at:</label>
  //             <span className="text-foreground">
  //               {user?.createdAt ? format(new Date(user?.createdAt), "dd/MM/yyyy") : "-"}
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  //   return (
  //     <Fragment>
  //       {" "}
  //       <DynamicForm
  //         config={userFormConfig}
  //         onSubmit={submit}
  //         mapValues={{ ...user, permissions: tableUserPermissions }}
  //       />
  //     </Fragment>
  //   );
  // }, [mode, submit, tableUserPermissions, user, userFormConfig]);

  const DrawerContent = <div>Content</div>;
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden sm:rounded-lg">
      <BaseDrawerHeader
        mode={mode}
        title={title}
        onClose={onClose}
        editable={editable}
        onToggle={(mode) => setMode(mode as DRAWER_MODE)}
      />
      <div className="flex-1 overflow-y-auto px-1">{DrawerContent}</div>
    </div>
  );
}
