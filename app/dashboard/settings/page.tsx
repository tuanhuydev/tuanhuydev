"use client";

import PageContainer from "@app/components/DashboardModule/PageContainer";
import ConfigSection from "@app/components/SettingModule/ConfigSection";
import { Button } from "@app/components/ui/button";
import { useFetch } from "@features/Auth";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

function Page() {
  const { fetch } = useFetch();

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

  return (
    <PageContainer title="Setting">
      <ConfigSection title="Backup" description="Backup application data">
        <div className="flex items-start gap-3">
          <Button variant="outline" onClick={downloadBackup}>
            Download Backup
          </Button>
        </div>
      </ConfigSection>
    </PageContainer>
  );
}

export default Page;
