import Card from "@resources/components/common/Card";
import PageContainer from "@resources/components/features/Dashboard/PageContainer";
import { CheckSquare, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const apps = [
    {
      title: "Personal Tasks",
      description: "Organize and track your daily tasks",
      icon: CheckSquare,
      href: "/dashboard/home/personal-tasks",
    },
    {
      title: "Budtr",
      description: "Manage budget and expenses",
      icon: DollarSign,
      href: "/dashboard/home/budtr",
    },
  ];

  return (
    <PageContainer title="Apps">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => {
          const Icon = app.icon;
          const content = (
            <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{app.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{app.description}</p>
                </div>
              </div>
            </Card>
          );

          return app.href ? (
            <Link key={app.title} href={app.href}>
              {content}
            </Link>
          ) : (
            <div key={app.title}>{content}</div>
          );
        })}
      </div>
    </PageContainer>
  );
}
