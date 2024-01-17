"use client";

import Badge from "@app/_components/commons/Badge";
import DynamicForm, { DynamicFormConfig } from "@app/_components/commons/Form/DynamicForm";
import {
  useCreateStatusMutation,
  useDeleteStatusMutation,
  useGetStatusQuery,
  useUpdateStatusMutation,
} from "@app/_store/slices/apiSlice";
import ConfigSection from "@components/SettingModule/ConfigSection";
import WithAuth from "@components/hocs/WithAuth";
import { Permissions } from "@lib/shared/commons/constants/permissions";
import { ObjectType } from "@lib/shared/interfaces/base";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { Status } from "@prisma/client";
import { notification } from "antd";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

const Modal = dynamic(async () => (await import("antd/es/modal/Modal")).default, { ssr: false });
const Button = dynamic(async () => (await import("antd/es/button")).default, { ssr: false });
const Popconfirm = dynamic(async () => (await import("antd/es/popconfirm")).default, { ssr: false });
const Table = dynamic(async () => (await import("antd/es/table")).default, { ssr: false });

function Page({ setTitle, setPageKey }: any) {
  const [api, contextHolder] = notification.useNotification();

  const { data: status = [], isLoading, isError: isStatusError } = useGetStatusQuery({});
  const [deleteStatus, { isSuccess: deleteStatusSuccess }] = useDeleteStatusMutation();
  const [createStatus, { isSuccess: createStatusSuccess }] = useCreateStatusMutation();
  const [updateStatus, { isSuccess: updateStatusSuccess }] = useUpdateStatusMutation();

  const [statusModal, setStatusModal] = React.useState(false);
  const [editingStatus, setEditingStatus] = React.useState<Status | undefined>(undefined);

  const handleDelete = (id: string) => async () => {
    await deleteStatus(Number.parseInt(id));
  };
  const triggerStatusForm = (value: boolean, status?: Status) => () => {
    setStatusModal(value);
    if (status) setEditingStatus(status);
  };

  const submitStatus = async (formData: FieldValues, form: UseFormReturn) => {
    const { id, ...restFormData } = formData;
    const savedRecord = id
      ? await updateStatus({ id: Number.parseInt(id), ...restFormData })
      : await createStatus(restFormData);

    if (savedRecord) {
      setStatusModal(false);
      form.reset();
    }
  };

  const columns: ColumnsType<any> = [
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
  ];

  useEffect(() => {
    if (setTitle) setTitle("Settings");
    if (setPageKey) setPageKey(Permissions.VIEW_SETTINGS);
  }, [setTitle, setPageKey]);

  useEffect(() => {
    if (deleteStatusSuccess) {
      api.success({ message: "Delete status successfully" });
    } else if (createStatusSuccess || updateStatusSuccess) {
      api.success({ message: "Save successfully" });
    }
  }, [api, deleteStatusSuccess, createStatusSuccess, updateStatusSuccess]);

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

  return (
    <div>
      {contextHolder}
      <ConfigSection
        title="Status"
        extra={
          <Button type="primary" onClick={triggerStatusForm(true)}>
            New Status
          </Button>
        }>
        {!isStatusError && <Table loading={isLoading} dataSource={status} columns={columns} rowKey="id" />}
      </ConfigSection>
      <ConfigSection title="Backup" description="Backup application data">
        <div className="flex gap-3">
          <Button type="primary">Download Backup</Button>
          <Button>Upload Backup</Button>
        </div>
      </ConfigSection>
      <Modal title="Create Status" open={statusModal} onCancel={() => setStatusModal(false)} footer={null}>
        <DynamicForm config={statusFormConfig} onSubmit={submitStatus} mapValues={editingStatus} />
      </Modal>
    </div>
  );
}

export default WithAuth(Page);
