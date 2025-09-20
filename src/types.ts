export interface WorkItem {
  company: string;
  role: string;
  start: string;
  end?: string;
  description?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  start: string;
  end?: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  work: WorkItem[];
  education: EducationItem[];
}
