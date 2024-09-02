export type Exam = {
  id: number;
  duration_in_minutes: number;
  cost: number;
  questions: Question[];
  name: string;
  description: string;
  features: string;
  user_exam: {
    id: number;
    status: string;
    started_at: string;
    submitted_at: string;
    exam_score: number;
    is_success: boolean;
    right_answers_count: number;
  };
};

export interface QuizOption {
  id: number;
  name: string;
}
export interface Question {
  id: number;
  question_type: string;
  options: QuizOption[];
  answers: [
    {
      id: number;
      option_id: number;
      user_exam_id: number;
      question_id: number;
      name: string;
    },
  ];
  name: string;
}
