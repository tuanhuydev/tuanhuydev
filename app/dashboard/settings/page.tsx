"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";
import ConfigSection from "@app/components/SettingModule/ConfigSection";
import BaseButton from "@app/components/commons/buttons/BaseButton";
import { useFetch } from "@app/queries/useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import React from "react";

function Page() {
  const { fetch } = useFetch();
  const [downloading, setDownloading] = React.useState(false);

  const downloadBackup = async () => {
    setDownloading(true);
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
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PageContainer title="Setting">
      <ConfigSection title="Backup" description="Backup application data">
        <div className="flex items-start gap-3">
          <BaseButton variants="outline" loading={downloading} onClick={downloadBackup} label="Download Backup" />
        </div>
      </ConfigSection>
    </PageContainer>
  );
}

export default Page;
