export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface QuizSession {
  id: string;
  quizId: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  endedAt?: Date;
  participants: QuizParticipant[];
}

export interface QuizParticipant {
  userId: string;
  joinedAt: Date;
  completed: boolean;
  answers: ParticipantAnswer[];
  score?: number;
}

export interface ParticipantAnswer {
  questionId: string;
  selectedOptionId: string;
  timeSpent: number;
  correct: boolean;
}

export interface QuizResult {
  id: string;
  sessionId: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
}

export interface QuizStats {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalParticipants: number;
  questionsStats: QuestionStat[];
}

export interface QuestionStat {
  questionId: string;
  questionText: string;
  correctPercentage: number;
  averageTimeSpent: number;
  optionDistribution: Record<string, number>;
}
