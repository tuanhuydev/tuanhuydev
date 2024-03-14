"use client";

import PageContainer from "@app/_components/DashboardModule/PageContainer";
import BaseButton from "@app/_components/commons/buttons/BaseButton";
import Loader from "@components/commons/Loader";
import { ControlPointOutlined, PersonOutlineOutlined, SearchOutlined } from "@mui/icons-material";
import { User } from "@prisma/client";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useState } from "react";

const Button = dynamic(async () => (await import("antd/es/button")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Avatar = dynamic(async () => (await import("antd/es/avatar")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Input = dynamic(async () => (await import("antd/es/input")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const Table = dynamic(async () => (await import("antd/es/table")).default, {
  ssr: false,
  loading: () => <Loader />,
});

function Page() {
  const [filter, setFilter] = useState<ObjectType>({});
  const users: any[] = [];
  const isUserLoading: boolean = false;

  const searchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const search = e.target.value;
      setFilter((currentFilter) => ({ ...currentFilter, search }));
    }, 500);
  };
  const createUser = () => {
    // TODO: Implement this function
  };

  const columns: ColumnsType<Partial<User>> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="flex items-center gap-3">
          <Avatar size="small" icon={<PersonOutlineOutlined className="!h-5 !w-5" />} />
          <h3 className="m-0 capitalize">{text}</h3>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      dataIndex: "id",
      key: "id",
      fixed: "right",
      render: (value) => <Fragment />,
    },
  ];

  return (
    <PageContainer title="Users">
      <div data-testid="dashboard-posts-page-testid" className="mb-3 flex items-center">
        <Input
          size="large"
          placeholder="Find your user"
          onChange={searchUser}
          className="grow mr-2 rounded-sm"
          prefix={<SearchOutlined className="!text-lg" />}
        />
        <div>
          <BaseButton
            label="New User"
            icon={<ControlPointOutlined fontSize="small" />}
            onClick={createUser}></BaseButton>
        </div>
      </div>
      <div className="grow overflow-auto pb-3">
        <Table columns={columns} dataSource={users} loading={isUserLoading} />
      </div>
    </PageContainer>
  );
}

export default Page;
