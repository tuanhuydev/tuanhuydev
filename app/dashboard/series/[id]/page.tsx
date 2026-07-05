import styles from "../../dashboard.module.css";
import { SeriesFormV2 } from "@app/resources/components/features/Series/SeriesFormV2";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { notFound } from "next/navigation";
import { getSeriesById } from "server/actions/seriesActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  const series = await getSeriesById(id);

  if (!series) notFound();

  return (
    <PageContainer title="Edit Series" goBack="/dashboard/series">
      <div className={styles.editWrap}>
        <SeriesFormV2 series={series} />
      </div>
    </PageContainer>
  );
}
