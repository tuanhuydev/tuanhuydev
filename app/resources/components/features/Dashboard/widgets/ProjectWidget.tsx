import { Card, CardContent, CardHeader, CardTitle } from "@resources/components/common/Card";
import { useProjectsQuery } from "@resources/queries/projectQueries";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function ProjectWidget() {
  const { data: projects = [] } = useProjectsQuery({ userId: "me" });
  return (
    <Link href={"/dashboard/projects"} prefetch className="self-baseline">
      <Card className="w-[12rem] min-h-[8rem]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <LayoutGrid className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects?.length || 0}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
