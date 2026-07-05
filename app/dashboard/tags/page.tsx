import styles from "../dashboard.module.css";
import { Tag } from "@app/resources/types/tag.types";
import { UrlParams } from "@lib/interfaces/shared";
import Empty from "@resources/components/common/Empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@resources/components/common/Table";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import TagsFilter from "@resources/components/features/Tag/TagsFilter";
import Link from "next/link";
import { getTags } from "server/actions/tagActions";

export default async function Page({ searchParams }: { searchParams: Promise<UrlParams> }) {
  const { search = "" } = await searchParams;
  const tags = await getTags({ search });

  return (
    <PageContainer title="Tags">
      <TagsFilter searchPlaceholder="Find your tag" createLabel="New tag" />
      <div className={styles.listBody}>
        {!tags.length ? (
          <Empty />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag: Tag) => (
                <TableRow key={tag.id} className={styles.rowClickable}>
                  <TableCell>
                    <Link href={`/dashboard/tags/${tag.id}`}>{tag.name}</Link>
                  </TableCell>
                  <TableCell>{tag.slug}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageContainer>
  );
}
