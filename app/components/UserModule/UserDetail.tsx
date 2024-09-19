"use client";

import DynamicForm, { DynamicFormConfig } from "../commons/Form/DynamicForm";
import { DRAWER_MODE } from "../commons/drawers";
import BaseDrawerHeader from "../commons/drawers/BaseDrawerHeader";
import { useUserPermissions } from "@app/queries/permissionQueries";
import { useProjectsQuery } from "@app/queries/projectQueries";
import { useCreateUser, useUpdateUserDetail } from "@app/queries/userQueries";
import LogService from "@lib/services/LogService";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import { Avatar, notification } from "antd";
import format from "date-fns/format";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export interface UserDetailProps {
  user?: ObjectType;
  onClose: () => void;
}

const revertTableUserPermissions = (tableUserPermissions: any[]) => {
  const revertedUserPermissions: any[] = [];
  const permissionIds: number[] = [];

  tableUserPermissions.forEach((permission: any) => {
    const { permissionId, action, resourceId, type } = permission;
    if (!permissionIds.includes(permissionId)) {
      permissionIds.push(permissionId);
      revertedUserPermissions.push({
        id: permissionId,
        rules: [{ action, resourceId, type }],
      });
    } else {
      const existingPermission = revertedUserPermissions.find((p) => p.id === permissionId);
      if (existingPermission) {
        existingPermission.rules.push({ action, resourceId, type });
      }
    }
  });

  return revertedUserPermissions;
};

export default function UserDetail({ user, onClose }: UserDetailProps) {
  // State
  const [mode, setMode] = useState<DRAWER_MODE>(DRAWER_MODE.VIEW);

  // Hooks
  const { mutateAsync: createUser, isSuccess: createdUserSuccess } = useCreateUser();
  const { mutateAsync: updateUser, isSuccess: updateUserSuccess } = useUpdateUserDetail();
  const { data: projects = [] } = useProjectsQuery();
  const { data: userPermissions = [], refetch: refetchUserPermission } = useUserPermissions(user?.id);

  // Map user permissions to table format
  const tableUserPermissions = userPermissions.flatMap(({ id, rules }: any) => {
    return rules.map(({ action, resourceId, type }: any) => ({
      permissionId: id,
      action,
      resourceId,
      type,
    }));
  });

  const userOptions = (projects as ObjectType[]).map(({ name, id }: ObjectType) => ({ label: name, value: id }));

  const isViewMode = mode === DRAWER_MODE.VIEW;
  const editable = !!user;
  const title = isViewMode && user ? "User Detail" : !user ? "Create new user" : "Edit User";

  const userFormConfig = useMemo((): DynamicFormConfig => {
    const userDetailFields = [
      {
        name: "name",
        type: "text",
        options: {
          placeholder: "John Doe",
          className: "w-1/2",
          autoComplete: "none",
        },
        validate: {
          required: true,
        },
      },
      {
        type: "email",
        name: "email",
        options: {
          placeholder: "JohnDoe@email.com",
          className: "w-1/2",
          autoComplete: "none",
        },
        validate: {
          required: true,
        },
      },
    ];
    if (!editable) {
      userDetailFields.push(
        {
          name: "password",
          type: "password",
          options: {
            placeholder: "P@ssw0rd!",
            className: "w-1/2",
            autoComplete: "new-password",
          },
          validate: {
            required: true,
          },
        },
        {
          name: "confirmPassword",
          type: "password",
          options: {
            className: "w-1/2",
            placeholder: "matched P@ssw0rd!",
            autoComplete: "new-password",
          },
          validate: {
            required: true,
            match: "password",
          } as any,
        },
      );
    }
    return {
      fields: [
        {
          name: "User Detail",
          fields: userDetailFields as any,
        },
        {
          name: "Project",
          fields: [
            {
              name: "projectIds",
              type: "select",
              options: {
                placeholder: "Project 1, project 2",
                mode: "multiple",
                options: userOptions,
              },
            },
          ],
        },
        {
          name: "Permission",
          fields: [
            {
              name: "permissions",
              type: "table",
              options: {
                placeholder: "permission",
                columns: [
                  {
                    config: {
                      field: "type",
                      headerName: "Type",
                      editable: true,
                      flex: 1,
                    },
                    options: [
                      { label: "Project", value: "project" },
                      { label: "Post", value: "post" },
                      { label: "User", value: "user" },
                      { label: "Sprint", value: "sprint" },
                    ],
                  },
                  {
                    config: {
                      field: "action",
                      headerName: "Action",
                      flex: 1,
                      editable: true,
                    },
                    options: [
                      { label: "View", value: "view" },
                      { label: "Create", value: "create" },
                      { label: "Edit", value: "edit" },
                      { label: "Update", value: "update" },
                      { label: "Delete", value: "delete" },
                      { label: "Download", value: "download" },
                    ],
                  },
                  {
                    config: {
                      field: "resourceId",
                      headerName: "Resource",
                      flex: 1,
                      editable: true,
                    },
                  },
                ],
              },
              validate: {
                min: 1,
              },
            },
          ],
        },
      ],
    };
  }, [editable, userOptions]);

  const submit = useCallback(
    async (formData: ObjectType, form?: UseFormReturn) => {
      try {
        const { permissions, ...restFormData } = formData;
        const userPermissions = revertTableUserPermissions(permissions);
        if (editable) {
          await updateUser({ ...user, ...restFormData, permissionIds: userPermissions });
          return;
        }
        await createUser({ ...restFormData, permissionIds: userPermissions });
        form?.reset();
        onClose();
      } catch (error) {
        form?.reset();
        LogService.log(error);
      }
    },
    [createUser, editable, onClose, updateUser, user],
  );

  useEffect(() => {
    if (!user) setMode(DRAWER_MODE.EDIT);
  }, [user]);

  useEffect(() => {
    let message = "User created successfully";
    if (updateUserSuccess) message = "User updated successfully";
    if (createdUserSuccess || updateUserSuccess) {
      notification.success({ message });
    }
  }, [createdUserSuccess, updateUserSuccess]);

  useEffect(() => {
    if (user?.id) {
      refetchUserPermission();
    }
  }, [refetchUserPermission, user?.id]);

  const DrawerContent = useMemo(() => {
    if (mode === DRAWER_MODE.VIEW) {
      return (
        <div className="flex flex-col h-full gap-3">
          <div className="p-3 grid grid-cols-6 grid-rows-12 gap-5 border-b border-solid border-transparent border-b-slate-100">
            <div className="flex gap-4 col-span-full border-b">
              <Avatar size={128} icon={<PersonOutlineOutlined fontSize="inherit" />} />
              <div className="my-5">
                <h2 className="text-2xl m-0 mb-1">{user?.name}</h2>
                <h4 className="m-0 font-normal text-slate-400">{user?.email}</h4>
              </div>
            </div>
            <div className="flex gap-4 col-span-3 border-b">
              <label className="font-normal text-slate-400">Project:</label>
              Project
            </div>
            <div className="flex gap-4 col-span-3 border-b">
              <label className="font-normal text-slate-400">Role:</label>
              Field project
            </div>
            <div className="flex gap-4 col-span-3 border-b">
              <label className="font-normal text-slate-400">Status:</label>
              Field status
            </div>
          </div>
          <div className="mt-auto p-3">
            <div className="flex gap-4 col-span-3 border-b">
              <label className="font-normal text-slate-400">Created at:</label>
              {user?.createdAt ? format(new Date(user?.createdAt), "dd/MM/yyyy") : "-"}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Fragment>
        <DynamicForm
          config={userFormConfig}
          onSubmit={submit}
          mapValues={{ ...user, permissions: tableUserPermissions }}
          submitProps={{ className: "ml-auto" }}
        />
      </Fragment>
    );
  }, [mode, submit, tableUserPermissions, user, userFormConfig]);

  return (
    <div className="flex flex-col h-full gap-3">
      <BaseDrawerHeader
        mode={mode}
        title={title}
        onClose={onClose}
        editable={editable}
        onToggle={(mode) => setMode(mode as DRAWER_MODE)}
      />
      {DrawerContent}
    </div>
  );
}
