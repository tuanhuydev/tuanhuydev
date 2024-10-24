"use client";

import BaseButton from "./buttons/BaseButton";
import { useGlobal } from "./providers/GlobalProvider";
import LogService from "@lib/services/LogService";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import React, { ChangeEvent, Fragment, MouseEventHandler, useState } from "react";

export interface BaseUploadProps {}

export default function BaseUpload() {
  const { notify } = useGlobal();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const changeFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles(Array.from(fileList));
    }
  };

  const removeFile = (fileToRemove: File) => () => {
    const updatedFiles = files.filter((file: File) => file !== fileToRemove);
    setFiles(updatedFiles);
  };

  const uploadFiles: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!files?.length) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await fetch("/api/upload/backup", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload backup");
      setFiles([]);
      notify("Backup uploaded", "success");
    } catch (error) {
      LogService.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-50">
      {files.length ? (
        <Fragment>
          <BaseButton
            label="Start Upload"
            disabled={uploading}
            loading={uploading}
            onClick={uploadFiles}
            color="primary"
          />
          <ul className="list-none p-0 mx-0">
            {Array.from(files).map((file: File) => (
              <li key={file.name} className="flex items-center gap-2">
                {file.name}
                <BaseButton
                  onClick={removeFile(file)}
                  icon={<CloseOutlined fontSize="small" />}
                  variants="text"
                  disabled={uploading}
                  className="text-red-500"
                />
              </li>
            ))}
          </ul>
        </Fragment>
      ) : (
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-primary text-slate-50 px-3 py-2 min-w-max border-none rounded-md flex justify-center items-center gap-1 transition-all duration-300">
          Upload Backup
        </label>
      )}

      <input id="file-upload" type="file" onChange={changeFiles} className="hidden" name="file" />
    </div>
  );
}
