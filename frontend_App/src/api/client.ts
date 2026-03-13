import { Platform } from "react-native";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  current_stage?: string | null;
  target_career?: string | null;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  current_stage?: string;
  target_career?: string;
};

export type ProfileUpdatePayload = {
  current_stage?: string;
  target_career?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};

export type AssessmentRequest = {
  education_level: string;
  programming_skill: number;
  math_skill: number;
  problem_solving: number;
  projects: number;
  experience: number;
  system_design: number;
  communication: number;
  ai_knowledge: number;
  target_role: string;
};

export type AssessmentSkillGap = {
  skill: string;
  current_level: string;
  required_level: string;
  recommendation: string;
};

export type CareerPlanSkillInput = {
  gpa: number;
  internships: number;
  projects: number;
  certifications: number;
  soft_skills_score: number;
  networking_score: number;
};

export type AssessmentResponse = {
  target_role: string;
  education_level: string;
  readiness_score: number;
  career_level: string;
  strengths: string[];
  skill_gaps: AssessmentSkillGap[];
  radar_chart: Record<string, number>;
  skill_graph: Record<string, number>;
  recommended_focus_areas: string[];
  summary: string;
  career_plan_inputs: CareerPlanSkillInput;
};

export type CareerPlanRequest = {
  current_stage: string;
  target_career: string;
  current_role?: string;
  skills?: CareerPlanSkillInput;
};

export type CareerPlanResponse = {
  target_career: string;
  current_stage: string;
  current_role?: string | null;
  is_custom_career: boolean;
  career_path: Array<{
    stage: string;
    label: string;
    tasks: string[];
    status: string;
  }>;
  next_steps: string[];
  skill_gaps: Array<{
    skill: string;
    status: string;
    priority: string;
    recommendation: string;
  }>;
  readiness?: {
    career_readiness: string;
    confidence: number;
  } | null;
  roadmap: {
    summary?: string;
    phases?: Array<{
      phase: string;
      actions: string[];
    }>;
  };
};

export type ProgressTask = {
  id: number;
  phase: string;
  action: string;
  done: boolean;
  estimated_days: number;
};

export type ProgressEntry = {
  id: string;
  target_career: string;
  current_stage: string;
  current_role?: string | null;
  is_custom_career: boolean;
  roadmap_summary?: string | null;
  tasks: ProgressTask[];
  created_at: string;
};

export type ProgressList = {
  count: number;
  entries: ProgressEntry[];
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000");

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.detail || body.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function signupUser(payload: SignupPayload): Promise<{ message: string }> {
  return request<{ message: string }>("/api/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthTokenResponse> {
  return request<AuthTokenResponse>("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getProfile(token: string): Promise<UserProfile> {
  return request<UserProfile>("/api/profile", { method: "GET" }, token);
}

export async function updateProfile(
  token: string,
  payload: ProfileUpdatePayload,
): Promise<UserProfile> {
  return request<UserProfile>(
    "/api/profile",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function submitAssessment(
  payload: AssessmentRequest,
  token?: string | null,
): Promise<AssessmentResponse> {
  return request<AssessmentResponse>(
    "/api/assessment",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function getLatestAssessment(token: string): Promise<AssessmentResponse> {
  return request<AssessmentResponse>("/api/assessment/latest", { method: "GET" }, token);
}

export async function createCareerPlan(
  payload: CareerPlanRequest,
  token?: string | null,
): Promise<CareerPlanResponse> {
  return request<CareerPlanResponse>(
    "/api/career-plan",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function getProgress(token: string): Promise<ProgressList> {
  return request<ProgressList>("/api/progress", { method: "GET" }, token);
}

export async function updateProgressTask(
  planId: string,
  taskId: number,
  done: boolean,
  token: string,
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(
    `/api/progress/${planId}/task`,
    {
      method: "PATCH",
      body: JSON.stringify({ task_id: taskId, done }),
    },
    token,
  );
}

export function humanizeKey(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getStageFromEducationLevel(educationLevel?: string | null): string {
  if (!educationLevel) {
    return "Undergraduate";
  }

  switch (educationLevel.toLowerCase()) {
    case "high school":
      return "Class 11-12";
    case "master's":
    case "master's degree":
    case "phd":
      return "Graduate";
    default:
      return "Undergraduate";
  }
}

export function buildCareerPlanPayload(
  user: UserProfile | null,
  assessment: AssessmentResponse | null,
): CareerPlanRequest {
  return {
    current_stage: user?.current_stage || getStageFromEducationLevel(assessment?.education_level),
    target_career: user?.target_career || assessment?.target_role || "Software Engineer",
    skills: assessment?.career_plan_inputs,
  };
}
