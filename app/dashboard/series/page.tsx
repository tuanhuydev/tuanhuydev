import styles from "../dashboard.module.css";
import { Series } from "@app/resources/types/series.types";
import { UrlParams } from "@lib/interfaces/shared";
import Empty from "@resources/components/common/Empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@resources/components/common/Table";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import SeriesFilter from "@resources/components/features/Series/SeriesFilter";
import Link from "next/link";
import { getAllSeries } from "server/actions/seriesActions";

export default async function Page({ searchParams }: { searchParams: Promise<UrlParams> }) {
  const { search = "" } = await searchParams;
  const series = await getAllSeries({ search });

  return (
    <PageContainer title="Series">
      <SeriesFilter searchPlaceholder="Find your series" createLabel="New series" />
      <div className={styles.listBody}>
        {!series.length ? (
          <Empty />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {series.map((item: Series) => (
                <TableRow key={item.id} className={styles.rowClickable}>
                  <TableCell>
                    <Link href={`/dashboard/series/${item.id}`}>{item.name}</Link>
                  </TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell className={styles.clamp1}>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageContainer>
  );
}
