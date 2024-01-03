import { EMPTY_OBJECT } from "@lib/configs/constants";
import { RootState } from "@lib/configs/types";
import { authActions } from "@lib/store/slices/authSlice";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment, PropsWithChildren, ReactNode, memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Popover = dynamic(async () => (await import("antd/es/popover")).default, { ssr: false });
const Button = dynamic(async () => (await import("antd/es/button")).default, { ssr: false });

const PersonOutlineOutlined = dynamic(() => import("@mui/icons-material/PersonOutlineOutlined"), {
  ssr: false,
});
const KeyboardArrowLeftOutlined = dynamic(() => import("@mui/icons-material/KeyboardArrowLeftOutlined"), {
  ssr: false,
});
const ExitToAppOutlined = dynamic(() => import("@mui/icons-material/ExitToAppOutlined"), {
  ssr: false,
});

interface NavbarProps extends PropsWithChildren {
  title?: string;
  goBack?: boolean;
  startComponent?: ReactNode;
  endComponent?: ReactNode;
}

const Navbar = ({ title, goBack = false, startComponent, endComponent }: NavbarProps) => {
  // Hook
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser) || {};

  // State
  const [open, setOpenUserMenu] = useState(false);

  const signOut = useCallback(() => {
    localStorage.clear();
    dispatch(authActions.setAuth(EMPTY_OBJECT));
    router.replace("/auth/sign-in");
  }, [dispatch, router]);

  const toggleUserMenu = useCallback(
    (value: boolean) => () => {
      if (!value) return setOpenUserMenu(!open);

      setOpenUserMenu(value);
      signOut();
    },
    [open, signOut],
  );

  const renderStart = useMemo(() => {
    if (startComponent) return startComponent;
    if (title)
      return (
        <div className="flex items-center gap-1">
          {goBack && <Button type="text" onClick={() => router.back()} icon={<KeyboardArrowLeftOutlined />} />}
          <h1 className="my-auto text-xl font-bold capitalize">{title}</h1>
        </div>
      );
    return <Fragment />;
  }, [goBack, router, startComponent, title]);

  const renderEnd = useMemo(() => {
    return (
      <Popover
        placement="bottom"
        title={currentUser.name}
        content={
          <ul className="block m-0 p-0 list-none ">
            <li className="mb-2 text-xs text-slate-500">{currentUser.email}</li>
            <li
              className="mb-2 text-slate-500 hover:text-slate-700 cursor-pointer flex items-center"
              onClick={toggleUserMenu(true)}>
              <ExitToAppOutlined className="mr-2 !text-base leading-none" />
              Sign out
            </li>
          </ul>
        }
        overlayInnerStyle={{ width: "12rem" }}
        trigger="click"
        open={open}
        onOpenChange={toggleUserMenu(false)}>
        <Button shape="circle" type="text" size="large" icon={<PersonOutlineOutlined />} />
      </Popover>
    );
  }, [currentUser.email, currentUser.name, open, toggleUserMenu]);

  return (
    <div className="px-3 py-2 bg-white flex item-center justify-between">
      {renderStart}
      {renderEnd}
    </div>
  );
};

export default memo(Navbar);
