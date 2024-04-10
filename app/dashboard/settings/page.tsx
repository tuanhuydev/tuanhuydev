"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import Badge from "@app/_components/commons/Badge";
import BaseUpload from "@app/_components/commons/BaseUpload";
import DynamicForm, { DynamicFormConfig } from "@app/_components/commons/Form/DynamicForm";
import BaseButton from "@app/_components/commons/buttons/BaseButton";
import {
  useCreateStatusMutation,
  useDeleteStatusMutation,
  useStatusQuery,
  useUpdateStatusMutation,
} from "@app/queries/statusQueries";
import { useFetch } from "@app/queries/useSession";
import ConfigSection from "@components/SettingModule/ConfigSection";
import { BASE_URL } from "@lib/configs/constants";
import LogService from "@lib/services/LogService";
import BaseError from "@lib/shared/commons/errors/BaseError";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { Status } from "@prisma/client";
import notification from "antd/es/notification";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

const Modal = dynamic(async () => import("antd/es/modal/Modal"), { ssr: false });
const Popconfirm = dynamic(async () => import("antd/es/popconfirm"), { ssr: false });
const Table = dynamic(async () => import("antd/es/table"), { ssr: false });

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
      validate: { required: true },
    },
    {
      name: "color",
      type: "colorpicker",
      className: "w-1/2",
      options: {
        placeholder: "Color",
      },
      validate: { required: true },
    },
  ],
};

function Page() {
  const { fetch } = useFetch();
  const { data: status = [], isLoading: isStatusLoading, isError: isStatusError } = useStatusQuery();
  const {
    mutate: createStatusMutation,
    isError: isCreateError,
    isSuccess: isCreateSuccess,
  } = useCreateStatusMutation();
  const {
    mutate: updateStatusMutation,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
  } = useUpdateStatusMutation();

  const {
    mutate: deleteStatusMutation,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
  } = useDeleteStatusMutation();

  const [statusModal, setStatusModal] = React.useState(false);
  const [editingStatus, setEditingStatus] = React.useState<Status | undefined>(undefined);

  const handleDelete = useCallback(
    (id: string) => async () => {
      await deleteStatusMutation(Number.parseInt(id));
    },
    [deleteStatusMutation],
  );

  const triggerStatusForm = (value: boolean, status?: Status) => () => {
    setStatusModal(value);
    if (status) setEditingStatus(status);
  };

  const downloadBackup = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/backup`, { method: "GET" });
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

  const statusFormSubmit = async (formData: FieldValues, form?: UseFormReturn) => {
    try {
      const isUpdatingStatus = !!formData?.id;
      if (isUpdatingStatus) return updateStatusMutation(formData);
      return createStatusMutation(formData);
    } catch (error) {
      LogService.log(error);
    } finally {
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
          <div className="flex items-start content-start gap-2">
            <BaseButton
              variants="text"
              onClick={triggerStatusForm(true, record)}
              icon={<EditOutlined className="text-slate-500" fontSize="small" />}
            />
            <Popconfirm
              icon={<DeleteOutlineOutlined fontSize="small" className="mr-2" />}
              title="Delete the task"
              arrow={false}
              description="Are you sure to delete this status?"
              onConfirm={handleDelete(id)}
              okText="Delete"
              cancelText="Cancel">
              <BaseButton
                variants="text"
                icon={<DeleteOutlineOutlined fontSize="small" className="text-slate-500" />}
              />
            </Popconfirm>
          </div>
        ),
      },
    ],
    [handleDelete],
  );

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess || isDeleteSuccess) {
      setEditingStatus(undefined);
      setStatusModal(false);
      notification.success({ message: `Status ${isDeleteSuccess ? "deleted" : "saved"} successfully` });
    }
  }, [isCreateSuccess, isDeleteSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (isCreateError || isUpdateError || isDeleteError) {
      notification.error({ message: `Status ${isDeleteSuccess ? "deleted" : "saved"} failed` });
    }
  }, [isCreateError, isDeleteError, isDeleteSuccess, isUpdateError]);

  return (
    <PageContainer title="Setting">
      <ConfigSection
        title="Status"
        extra={
          <BaseButton
            label="New Status"
            icon={<ControlPointOutlined fontSize="small" />}
            onClick={triggerStatusForm(true)}
          />
        }>
        {!isStatusError && <Table loading={isStatusLoading} dataSource={status} columns={getColumns} rowKey="id" />}
      </ConfigSection>
      <ConfigSection title="Backup" description="Backup application data">
        <div className="flex items-start gap-3">
          <BaseButton variants="outline" onClick={downloadBackup} label="Download Backup" />
          <BaseUpload />
        </div>
      </ConfigSection>
      <Modal
        title="Create Status"
        getContainer={false}
        open={statusModal}
        destroyOnClose
        onCancel={() => setStatusModal(false)}
        footer={null}>
        <DynamicForm config={statusFormConfig} onSubmit={statusFormSubmit} mapValues={editingStatus} />
      </Modal>
    </PageContainer>
  );
}

export default Page;
