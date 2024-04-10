import DynamicForm, { DynamicFormConfig } from "../commons/Form/DynamicForm";
import BaseButton from "../commons/buttons/BaseButton";
import { USER_DETAIL_MODE } from "@app/_configs/constants";
import { usePermissions } from "@app/queries/authQueries";
import { useProjectsQuery } from "@app/queries/projectQueries";
import { useCreateUser } from "@app/queries/userQueries";
import LogService from "@lib/services/LogService";
import { CloseOutlined } from "@mui/icons-material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import { Project, User } from "@prisma/client";
import { Avatar, notification } from "antd";
import format from "date-fns/format";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export interface UserDetailProps {
  user?: User;
  onClose: () => void;
}

export default function UserDetail({ user, onClose }: UserDetailProps) {
  const [mode, setMode] = useState<USER_DETAIL_MODE>(USER_DETAIL_MODE.VIEW);
  const { mutateAsync: createUser, isSuccess } = useCreateUser();
  const { data: projects = [] } = useProjectsQuery();
  const { data: permissions = [] } = usePermissions();

  const isViewMode = mode === USER_DETAIL_MODE.VIEW;
  const isEditMode = mode === USER_DETAIL_MODE.EDIT;
  const allowEdit = isEditMode && user;
  const title = isViewMode && user ? "User Detail" : !user ? "Create new user" : "Edit User";

  const getConfig = useCallback((): DynamicFormConfig => {
    const userOptions = (projects as Project[]).map(({ name, id }: Project) => ({ label: name, value: id }));
    const permissionOptions = (permissions as any[]).map(({ name, id }: any) => ({ label: name, value: id }));
    return {
      fields: [
        {
          name: "name",
          type: "text",
          options: {
            placeholder: "John Doe",
            className: "w-1/2",
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
        {
          name: "password",
          type: "password",
          className: "w-1/2",
          options: {
            placeholder: "P@ssw0rd!",
            autoComplete: "new-password",
          },
          validate: {
            required: true,
          },
        },
        {
          name: "confirmPassword",
          type: "password",
          className: "w-1/2",
          options: {
            placeholder: "matched P@ssw0rd!",
            autoComplete: "new-password",
          },
          validate: {
            required: true,
            match: "password",
          },
        },
        {
          name: "project",
          type: "select",
          options: {
            placeholder: "Project 1, project 2",
            mode: "multiple",
            allowClear: true,
            options: userOptions,
          },
        },
        {
          name: "permissionId",
          type: "select",
          options: {
            placeholder: "Root, Maintainer, Guest",
            options: permissionOptions,
          },
        },
      ],
    };
  }, [permissions, projects]);

  const DrawerHeader = useMemo(() => {
    return (
      <div className="flex items-center bg-slate-700 justify-between pr-3">
        <h1 className="my-0 mr-3 px-3 py-2 bg-primary text-white text-base">{title}</h1>
        <div className="flex items-center gap-2">
          {allowEdit && (
            <BaseButton
              onClick={() => setMode(USER_DETAIL_MODE.EDIT)}
              icon={<EditOutlined className="!text-lg text-slate-50" />}
            />
          )}
          <BaseButton onClick={onClose} icon={<CloseOutlined className="!text-lg text-white" />} />
        </div>
      </div>
    );
  }, [allowEdit, onClose, title]);

  const submit = useCallback(
    async (formData: ObjectType, form?: UseFormReturn) => {
      try {
        await createUser(formData);
        form?.reset();
        onClose();
      } catch (error) {
        LogService.log(error);
      }
    },
    [createUser, onClose],
  );

  useEffect(() => {
    if (!user) setMode(USER_DETAIL_MODE.EDIT);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: "User created successfully",
      });
    }
  }, [isSuccess]);

  const DrawerContent = useMemo(() => {
    if (mode === USER_DETAIL_MODE.VIEW) {
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
      <DynamicForm
        config={getConfig()}
        onSubmit={submit}
        submitProps={{
          className: "ml-auto",
        }}
      />
    );
  }, [getConfig, mode, submit, user?.createdAt, user?.email, user?.name]);

  return (
    <div className="flex flex-col h-full gap-3">
      {DrawerHeader}
      {DrawerContent}
    </div>
  );
}
