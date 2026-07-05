import styles from "../dashboard.module.css";
import { Category } from "@app/resources/types/category.types";
import { UrlParams } from "@lib/interfaces/shared";
import Empty from "@resources/components/common/Empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@resources/components/common/Table";
import CategoriesFilter from "@resources/components/features/Category/CategoriesFilter";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import Link from "next/link";
import { getCategories } from "server/actions/categoryActions";

export default async function Page({ searchParams }: { searchParams: Promise<UrlParams> }) {
  const { search = "" } = await searchParams;
  const categories = await getCategories({ search });

  return (
    <PageContainer title="Categories">
      <CategoriesFilter searchPlaceholder="Find your category" createLabel="New category" />
      <div className={styles.listBody}>
        {!categories.length ? (
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
              {categories.map((category: Category) => (
                <TableRow key={category.id} className={styles.rowClickable}>
                  <TableCell>
                    <Link href={`/dashboard/categories/${category.id}`}>{category.name}</Link>
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className={styles.clamp1}>{category.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageContainer>
  );
}
