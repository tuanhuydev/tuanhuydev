"use client";

import ThemeToggle from "@app/_components/commons/ThemeToggle";
import { memo } from "react";

export interface NavbarProps {
  posts?: ObjectType[];
  withContact?: boolean;
}

export default memo(function Navbar({ posts = [], withContact = true }: NavbarProps) {
  return (
    <header className=" sticky top-0 z-10 flex items-center justify-between py-2 bg-slate-50 dark:bg-slate-900">
      <div className="text-primary dark:text-slate-50 font-bold flex items-center">
        <a href="/" className="line-height-1 hover:underline flex items-center cursor-pointer">
          <svg
            width="32"
            height="32"
            viewBox="0 0 16 16"
            fill="none"
            className="fill-primary dark:fill-slate-50"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6.3609V8.31087C2 8.42588 2.06982 8.5301 2.17816 8.57681L6.97816 10.6464C7.17655 10.7319 7.4 10.591 7.4 10.3804V8.98505C7.4 8.86756 7.32718 8.76159 7.21538 8.71641L4.46462 7.60453C4.21846 7.50503 4.21846 7.16674 4.46462 7.06724L7.21538 5.95536C7.32718 5.91017 7.4 5.80421 7.4 5.68672V4.29136C7.4 4.08075 7.17654 3.93988 6.97816 4.02541L2.17816 6.09495C2.06982 6.14166 2 6.24589 2 6.3609Z" />
            <path d="M14 10.6391V8.68913C14 8.57412 13.9302 8.4699 13.8218 8.42319L9.02184 6.35364C8.82346 6.26811 8.6 6.40898 8.6 6.61959V8.01495C8.6 8.13244 8.67282 8.23841 8.78462 8.28359L11.5354 9.39547C11.7815 9.49497 11.7815 9.83326 11.5354 9.93276L8.78462 11.0446C8.67282 11.0898 8.6 11.1958 8.6 11.3133V12.7086C8.6 12.9192 8.82346 13.0601 9.02184 12.9746L13.8218 10.905C13.9302 10.8583 14 10.7541 14 10.6391Z" />
          </svg>
          <h1 className="inline text-base lg:text-2xl dark:text-slate-50">tuanhuydev</h1>
        </a>
      </div>
      <div className="flex items-center gap-3">
        <ul className="flex md:justify-between list-none m-0 p-0">
          {posts?.length > 0 && (
            <li className="mr-1 lg:mr-3.5 cursor-pointer text-sm lg:text-base rounded-md hover:bg-slate-100 dark:hover:bg-slate-900">
              <a href="#blog">
                <div className="block px-4 py-1 dark:text-white capitalize">Blog</div>
              </a>
            </li>
          )}
        </ul>
        <ThemeToggle />
        {withContact && (
          <a
            href="#contact"
            className="rounded-full bg-stone-900 drop-shadow-md dark:bg-slate-50 dark:!text-primary !text-slate-50 text-xs md:text-base uppercase font-semibold px-2 py-0.5 md:px-4 md:py-1 cursor-pointer">
            Contact
          </a>
        )}
      </div>
    </header>
  );
});
