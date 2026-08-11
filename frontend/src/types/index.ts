export interface User {
  id: number;
  name: string;
  email: string;
  education?: string;
  dob?: string;
  profilePictureUrl?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Goal {
  id: number;
  title: string;
  description: string;
  status: GoalStatus;
  progress: number;
}

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  goal: Goal;
}

export interface DashboardResponse {
  totalGoals: number;
  completedGoals: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overallProgress: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors: string[];
  timestamp: string;
}

export interface ChatMessage {
  id: number;
  message: string;
  role: 'USER' | 'AI';
  createdAt: string;
}
