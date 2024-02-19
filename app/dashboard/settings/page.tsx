"use client";

import Badge from "@app/_components/commons/Badge";
import DynamicForm, { DynamicFormConfig } from "@app/_components/commons/Form/DynamicForm";
import WithPermission from "@app/_components/commons/hocs/WithPermission";
import {
  useCreateStatusMutation,
  useDeleteStatusMutation,
  useGetStatusQuery,
  useUpdateStatusMutation,
} from "@app/_configs/store/slices/apiSlice";
import ConfigSection from "@components/SettingModule/ConfigSection";
import { BASE_URL } from "@lib/configs/constants";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import BaseError from "@lib/shared/commons/errors/BaseError";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { Status } from "@prisma/client";
import { ColumnsType } from "antd/es/table";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

const Modal = dynamic(async () => (await import("antd/es/modal/Modal")).default, { ssr: false });
const Button = dynamic(async () => (await import("antd/es/button")).default, { ssr: false });
const Popconfirm = dynamic(async () => (await import("antd/es/popconfirm")).default, { ssr: false });
const Table = dynamic(async () => (await import("antd/es/table")).default, { ssr: false });

const statusFormConfig: DynamicFormConfig = {
  fields: [
    {
      name: "name",
      type: "text",
      options: {
        placeholder: "Status Name",
      },
      validate: { required: true },
    },
    {
      name: "description",
      type: "text",
      options: {
        placeholder: "Status Description",
      },
    },
    {
      name: "type",
      type: "select",
      className: "w-1/2",
      options: {
        placeholder: "Status Type",
        options: [
          { label: "Project", value: "project" },
          { label: "Task", value: "task" },
          { label: "User", value: "user" },
        ],
      },
    },
    {
      name: "color",
      type: "colorpicker",
      className: "w-1/2",
      options: {
        placeholder: "Color",
      },
    },
  ],
};

function Page({ setTitle }: any) {
  const { data: status = [], isLoading, isError: isStatusError } = useGetStatusQuery({});
  const [deleteStatus, { isSuccess: deleteStatusSuccess }] = useDeleteStatusMutation();
  const [createStatus, { isSuccess: createStatusSuccess }] = useCreateStatusMutation();
  const [updateStatus, { isSuccess: updateStatusSuccess }] = useUpdateStatusMutation();

  const [statusModal, setStatusModal] = React.useState(false);
  const [editingStatus, setEditingStatus] = React.useState<Status | undefined>(undefined);

  const handleDelete = useCallback(
    (id: string) => async () => {
      await deleteStatus(Number.parseInt(id));
    },
    [deleteStatus],
  );

  const triggerStatusForm = (value: boolean, status?: Status) => () => {
    setStatusModal(value);
    if (status) setEditingStatus(status);
  };

  const downloadBackup = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/backup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      if (!response.ok) throw new BaseError("Unable to save backup");
      const data = await response.json();

      if (!data) throw new BaseError("Unable to save backup");

      // Create blob from posts
      const postBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
      const url = window.URL.createObjectURL(postBlob);

      // Make hidden download element
      const downloadElement = document.createElement("a");
      downloadElement.style.display = "none";
      downloadElement.href = url;
      downloadElement.download = "backup.json";
      document.body.appendChild(downloadElement);
      downloadElement.click();
    } catch (error) {
      console.error(error);
    }
  };

  const submitStatus = async (formData: FieldValues, form?: UseFormReturn) => {
    const { id, ...restFormData } = formData;
    const savedRecord = id
      ? await updateStatus({ id: Number.parseInt(id), ...restFormData })
      : await createStatus(restFormData);

    if (savedRecord) {
      setStatusModal(false);
      form?.reset();
    }
  };

  const getColumns = useMemo(
    (): ColumnsType<any> => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "25%",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "25%",
      },
      {
        title: "Color",
        dataIndex: "color",
        key: "color",
        render: (color: string) => <Badge color={color} value={color} />,
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (type: string) => {
          const colorMap: ObjectType = {
            task: "bg-blue-500",
            project: "bg-red-500",
            user: "bg-gray-500",
            default: "bg-zinc-500",
          };
          return <Badge className={colorMap[type]} value={type} />;
        },
      },
      {
        title: "",
        dataIndex: "id",
        key: "id",
        render: (id: string, record: any) => (
          <Fragment>
            <Button
              type="text"
              onClick={triggerStatusForm(true, record)}
              icon={<EditOutlined className="text-slate-500" />}
            />
            <Popconfirm
              icon={<DeleteOutlineOutlined className="mr-2" />}
              title="Delete the task"
              arrow={false}
              description="Are you sure to delete this status?"
              onConfirm={handleDelete(id)}
              okText="Delete"
              cancelText="Cancel">
              <Button type="text" icon={<DeleteOutlineOutlined className="text-slate-500" />} />
            </Popconfirm>
          </Fragment>
        ),
      },
    ],
    [handleDelete],
  );

  useEffect(() => {
    if (setTitle) setTitle("Settings");
  }, [setTitle]);

  return (
    <div>
      <ConfigSection
        title="Status"
        extra={
          <Button type="primary" onClick={triggerStatusForm(true)}>
            New Status
          </Button>
        }>
        {!isStatusError && <Table loading={isLoading} dataSource={status} columns={getColumns} rowKey="id" />}
      </ConfigSection>
      <ConfigSection title="Backup" description="Backup application data">
        <div className="flex gap-3">
          <Button type="primary" onClick={downloadBackup}>
            Download Backup
          </Button>
          <Button>Upload Backup</Button>
        </div>
      </ConfigSection>
      <Modal
        title="Create Status"
        getContainer={false}
        open={statusModal}
        onCancel={() => setStatusModal(false)}
        footer={null}>
        <DynamicForm config={statusFormConfig} onSubmit={submitStatus} mapValues={editingStatus} />
      </Modal>
    </div>
  );
}

export default WithPermission(Page, Permissions.VIEW_SETTINGS);
