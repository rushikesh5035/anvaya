// Short month labels used for the activity chart X-axis and monthly bucketing.
export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

// Default React Query stale time for dashboard data (5 minutes).
// Prevents re-fetching GitHub API on every navigation.
export const DASHBOARD_STALE_TIME = 1000 * 60 * 5;

// Number of months to show in the activity chart.
export const ACTIVITY_MONTHS_COUNT = 6;
