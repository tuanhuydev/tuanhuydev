import PageContainer from "@app/components/DashboardModule/PageContainer";
import Card from "@app/components/commons/Card";
import Link from "next/link";

export default async function Page() {
  return (
    <PageContainer title="Apps">
      <div className="flex gap-3 flex-wrap">
        <Card className="w-[300px] h-[200px]">Personal Tasks</Card>
        <Link href="/dashboard/apps/chat">
          <Card className="w-[300px] h-[200px]">AI</Card>
        </Link>
        <Link href="/dashboard/apps/budtr">
          <Card className="w-[300px] h-[200px]">Budtr</Card>
        </Link>
      </div>
    </PageContainer>
  );
}
