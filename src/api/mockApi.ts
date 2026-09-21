import { SEED_STORIES } from "./seed";
import type { NewStory, Story, StoryFilters, StoryPatch } from "./types";

/**
 * A stand-in for a REST backend so the demo deploys as a static site. It adds
 * realistic latency, persists to localStorage, and can fail mutations on
 * demand so optimistic updates and rollback are visible.
 */

const STORAGE_KEY = "backlog-board:stories:v1";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const networkSettings = {
  /** Probability from 0 to 1 that any mutation is rejected. */
  failureRate: 0,
};

function seed(): Story[] {
  const now = Date.now();
  return SEED_STORIES.map((story, index) => ({
    ...story,
    id: `STORY-${101 + index}`,
    updatedAt: new Date(now - index * 3_600_000).toISOString(),
  }));
}

function load(): Story[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Story[];
  } catch {
    // Storage unavailable or corrupt: fall back to seed data.
  }
  return seed();
}

let stories: Story[] = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch {
    // Private browsing or quota exceeded: keep working in memory.
  }
}

function delay(min = 350, max = 900) {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mutation<T>(run: () => T): Promise<T> {
  await delay(500, 1100);
  if (Math.random() < networkSettings.failureRate) {
    throw new ApiError("The server rejected the change (simulated failure).");
  }
  const result = run();
  persist();
  return result;
}

function matches(story: Story, filters: StoryFilters) {
  if (filters.priority !== "all" && story.priority !== filters.priority) {
    return false;
  }
  if (filters.epic !== "all" && story.epic !== filters.epic) return false;
  const term = filters.search.trim().toLowerCase();
  if (!term) return true;
  return [story.id, story.title, story.description]
    .join(" ")
    .toLowerCase()
    .includes(term);
}

function nextId() {
  const highest = stories.reduce((max, story) => {
    const n = Number(story.id.replace("STORY-", ""));
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 100);
  return `STORY-${highest + 1}`;
}

export const api = {
  async listStories(filters: StoryFilters): Promise<Story[]> {
    await delay();
    return stories.filter((story) => matches(story, filters));
  },

  async getStory(id: string): Promise<Story> {
    await delay(250, 600);
    const story = stories.find((s) => s.id === id);
    if (!story) throw new ApiError(`${id} was not found.`);
    return story;
  },

  createStory(input: NewStory): Promise<Story> {
    return mutation(() => {
      const story: Story = {
        ...input,
        id: nextId(),
        updatedAt: new Date().toISOString(),
      };
      stories = [story, ...stories];
      return story;
    });
  },

  updateStory(id: string, patch: StoryPatch): Promise<Story> {
    return mutation(() => {
      const existing = stories.find((s) => s.id === id);
      if (!existing) throw new ApiError(`${id} was not found.`);
      const updated: Story = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      stories = stories.map((s) => (s.id === id ? updated : s));
      return updated;
    });
  },

  deleteStory(id: string): Promise<void> {
    return mutation(() => {
      stories = stories.filter((s) => s.id !== id);
    });
  },

  async resetStories(): Promise<void> {
    await delay(300, 500);
    stories = seed();
    persist();
  },
};
