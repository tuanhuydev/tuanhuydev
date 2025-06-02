import PageContainer from "@app/components/DashboardModule/PageContainer";
import Card from "@app/components/commons/Card";

const Page = () => {
  return (
    <PageContainer title="WorkSpace">
      <div className="flex gap-3 flex-wrap">
        <Card className="w-[300px] h-[200px]">Personal Tasks</Card>
        <Card className="w-[300px] h-[200px]">AI</Card>
      </div>
    </PageContainer>
  );
};

export default Page;
