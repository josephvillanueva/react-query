export const STATUSES = ["backlog", "ready", "in_progress", "done"] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["critical", "high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STORY_POINTS = [1, 2, 3, 5, 8, 13] as const;
export type StoryPoints = (typeof STORY_POINTS)[number];

export const EPICS = [
  "Checkout",
  "Accounts",
  "Notifications",
  "Reporting",
] as const;
export type Epic = (typeof EPICS)[number];

export interface Story {
  id: string;
  title: string;
  /** Written as "As a ..., I want ..., so that ..." */
  description: string;
  acceptanceCriteria: string[];
  status: Status;
  priority: Priority;
  points: StoryPoints;
  epic: Epic;
  updatedAt: string;
}

export type NewStory = Omit<Story, "id" | "updatedAt">;
export type StoryPatch = Partial<Omit<Story, "id" | "updatedAt">>;

export interface StoryFilters {
  search: string;
  priority: Priority | "all";
  epic: Epic | "all";
}

export const STATUS_LABELS: Record<Status, string> = {
  backlog: "Backlog",
  ready: "Ready",
  in_progress: "In Progress",
  done: "Done",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};
