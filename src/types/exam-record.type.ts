export type ExamListItem = {
  id: number;
  duration_in_minutes: number;
  cost: number;
  questions_count: number;
  name: string;
  description: string;
  features: string;
  is_paid: boolean;
  default_user_exam: DefaultUserExam;
  user_exams: UserExams[];
};

export type UserExams = {
  id: number;
  status: "PENDING";
  started_at: string;
  submitted_at: string;
  exam_score: number;
  is_success: boolean;
  right_answers_count: number;
};
export type DefaultUserExam = {
  id: number;
  status: "PENDING";
  started_at: string;
  submitted_at: string;
  exam_score: number;
  is_success: boolean;
  right_answers_count: number;
};
