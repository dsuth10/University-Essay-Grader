export interface Criterion {
  name: string;
  score: number;
  feedback: string;
}

export interface StyleMetric {
  category: string;
  rating: string;
  feedback: string;
}

export interface StyleAnalysis {
  tone: string;
  metrics: StyleMetric[];
  suggestions: string[];
}

export interface GradingResult {
  overallScore: number;
  letterGrade: string;
  summary: string;
  criteria: Criterion[];
  styleAnalysis: StyleAnalysis;
  strengths: string[];
  improvements: string[];
}

export enum GradingState {
  IDLE = 'IDLE',
  GRADING = 'GRADING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}
