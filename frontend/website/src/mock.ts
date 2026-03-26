export const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK !== "false";
const MOCK_TOKEN = "mock-token";

export interface MockUserInfo {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface MockIssue {
  id: number;
  userId: number;
  title: string;
  brief: string;
  description: string;
  location: string;
  status: "pending" | "processing" | "completed";
  witnessInfo: string;
  happenTime: string;
  urls: string[];
}

const MOCK_USER_KEY = "mock-user-role";
const MOCK_ISSUES_KEY = "mock-issues";

export const DEFAULT_MOCK_USER: MockUserInfo = {
  id: 1001,
  email: "student@uon.edu.au",
  name: "Jamie Student",
  role: "user",
};

export const DEFAULT_MOCK_ADMIN: MockUserInfo = {
  id: 1,
  email: "admin@uon.edu.au",
  name: "Alex Admin",
  role: "admin",
};

const DEFAULT_MOCK_ISSUES: MockIssue[] = [
  {
    id: 101,
    userId: 1001,
    title: "[Safety Hazard] Wet floor near library entrance",
    brief: "Wet floor near library entrance",
    description:
      "A slippery patch was left near the automatic doors after cleaning. No warning sign was visible when I arrived.",
    location: "Auchmuty Library Entrance",
    status: "pending",
    witnessInfo: "Security desk staff nearby",
    happenTime: "2026-03-24T09:15:00",
    urls: [],
  },
  {
    id: 102,
    userId: 1002,
    title: "[Equipment Damage] Broken projector in classroom",
    brief: "Projector flickering and shutting down",
    description:
      "The projector in room EA301 flickers for a few minutes and then powers off, which interrupts classes.",
    location: "Engineering Building EA301",
    status: "processing",
    witnessInfo: "Lecturer and 20 students present",
    happenTime: "2026-03-22T14:40:00",
    urls: [],
  },
  {
    id: 103,
    userId: 1003,
    title: "[Security Concern] Side gate left open overnight",
    brief: "Back gate unlocked overnight",
    description:
      "The side access gate beside the car park was still open at 7am. It may have been left unsecured overnight.",
    location: "North Car Park",
    status: "completed",
    witnessInfo: "",
    happenTime: "2026-03-20T07:00:00",
    urls: [],
  },
];

const readStoredRole = () => {
  if (typeof window === "undefined") {
    return DEFAULT_MOCK_USER.role;
  }

  const role = window.localStorage.getItem(MOCK_USER_KEY);
  return role === "admin" ? "admin" : "user";
};

export const getMockCurrentUser = (): MockUserInfo => {
  const role = readStoredRole();
  return role === "admin" ? DEFAULT_MOCK_ADMIN : DEFAULT_MOCK_USER;
};

export const setMockCurrentRole = (role: "admin" | "user") => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MOCK_USER_KEY, role);
};

export const ensureMockSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.localStorage.getItem("token")) {
    window.localStorage.setItem("token", MOCK_TOKEN);
  }
};

export const clearMockSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("token");
  window.localStorage.removeItem(MOCK_USER_KEY);
};

export const isMockToken = (token: string | null) => token === MOCK_TOKEN;

export const hasRealSession = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const token = window.localStorage.getItem("token");
  return !!token && !isMockToken(token);
};

export const shouldUseMock = () => ENABLE_MOCK && !hasRealSession();

export const getMockIssues = (): MockIssue[] => {
  if (typeof window === "undefined") {
    return DEFAULT_MOCK_ISSUES;
  }

  const stored = window.localStorage.getItem(MOCK_ISSUES_KEY);
  if (!stored) {
    window.localStorage.setItem(MOCK_ISSUES_KEY, JSON.stringify(DEFAULT_MOCK_ISSUES));
    return DEFAULT_MOCK_ISSUES;
  }

  try {
    return JSON.parse(stored) as MockIssue[];
  } catch {
    window.localStorage.setItem(MOCK_ISSUES_KEY, JSON.stringify(DEFAULT_MOCK_ISSUES));
    return DEFAULT_MOCK_ISSUES;
  }
};

export const saveMockIssues = (issues: MockIssue[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MOCK_ISSUES_KEY, JSON.stringify(issues));
};

export const createMockIssue = (
  payload: Omit<MockIssue, "id" | "userId" | "status">
): MockIssue => {
  const issues = getMockIssues();
  const nextId = issues.length > 0 ? Math.max(...issues.map((issue) => issue.id)) + 1 : 101;
  const user = getMockCurrentUser();

  return {
    id: nextId,
    userId: user.id,
    status: "pending",
    ...payload,
  };
};
