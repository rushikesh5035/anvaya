import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ContributionGraph from "./contribution-graph";

const ContributionActivityCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
        <CardDescription>
          Visualizing your coding frequency over the last year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContributionGraph />
      </CardContent>
    </Card>
  );
};

export default ContributionActivityCard;
