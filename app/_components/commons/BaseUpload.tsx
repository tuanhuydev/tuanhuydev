import React from "react";

export interface BaseUploadProps {}

export default function BaseUpload() {
  return (
    <form action={() => console.log("working")}>
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-primary text-slate-50 px-3 py-2 min-w-max border-none rounded-md flex justify-center items-center gap-1 transition-all duration-300">
        Upload file
      </label>
      <input id="file-upload" type="file" className="hidden" name="file" />
    </form>
  );
}
