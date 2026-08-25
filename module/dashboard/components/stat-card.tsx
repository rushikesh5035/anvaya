import { type ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number | string;
  description: string;
  isLoading?: boolean;
}

const StatCard = ({
  icon,
  title,
  value,
  description,
  isLoading = false,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground h-4 w-4">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isLoading ? "..." : value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
