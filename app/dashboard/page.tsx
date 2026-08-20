import ActivityBarChart from "@/module/dashboard/components/activity-bar-chart";
import ContributionActivityCard from "@/module/dashboard/components/contribution-activity-card";
import DashboardStatsSection from "@/module/dashboard/components/dashboard-stats-section";

const MainPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your coding activity and AI reviews
        </p>
      </div>

      {/* 4 stat cards: Repos, Commits, PRs, AI Reviews */}
      <DashboardStatsSection />

      {/* GitHub contribution activity */}
      <ContributionActivityCard />

      {/* Monthly activity bar chart */}
      <ActivityBarChart />
    </div>
  );
};

export default MainPage;
