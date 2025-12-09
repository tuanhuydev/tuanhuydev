import { useProjectsQuery } from "@app/_queries/projectQueries";
import Card from "@app/components/commons/Card";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function ProjectWidget() {
  const { data: projects = [] } = useProjectsQuery({ userId: "me" });
  return (
    <Link href={"/dashboard/projects"} prefetch className="self-baseline">
      <Card
        title="Projects"
        className="w-[12rem] min-h-[8rem]"
        value={projects?.length}
        icon={<LayoutGrid className="w-5 h-5" />}
      />
    </Link>
  );
}
