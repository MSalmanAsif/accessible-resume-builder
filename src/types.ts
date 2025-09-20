// Work experience item interface
export interface WorkItem {
  company: string;
  role: string;
  start: string;
  end?: string;
  description?: string;
}

// Education item interface
export interface EducationItem {
  school: string;
  degree: string;
  start: string;
  end?: string;
}

// Complete resume data structure
export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  work: WorkItem[];
  education: EducationItem[];
}

// Notification types for user feedback
export type NotificationType = 'success' | 'error' | 'info';