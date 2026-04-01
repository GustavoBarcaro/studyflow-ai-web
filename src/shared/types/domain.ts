export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type Topic = {
  id: string;
  name: string;
  color?: string | null;
};

export type LearningPathStatus = "active" | "completed";

export type LearningPathStep = {
  id: string;
  learningPathId: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  completedAt: string | null;
};

export type LearningPath = {
  id: string;
  userId: string;
  topicId: string;
  title: string;
  description: string;
  createdAt: string;
  status: LearningPathStatus;
  steps: LearningPathStep[];
};

export type SessionTopic = Topic;

export type StudySession = {
  id: string;
  title: string;
  topicId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  topic: SessionTopic;
};

export type Message = {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | string;
  content: string;
  createdAt: string;
  isPending?: boolean;
};

export type SessionDetails = StudySession & {
  messages: Message[];
};

export type CreateMessageResponse = {
  userMessage: Message;
  assistantMessage: Message;
};

export type SummarizeResponse = {
  summary: string;
};

export type StudyLevel = "beginner" | "intermediate";

export type ExplainAgainRequest = {
  focus?: string;
  level: StudyLevel;
};

export type ExplainAgainResponse = {
  explanation: string;
};

export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizOptionId = "A" | "B" | "C" | "D";

export type QuizOption = {
  id: QuizOptionId;
  text: string;
};

export type QuizQuestion = {
  question: string;
  options: QuizOption[];
  correctOptionId: QuizOptionId;
  explanation: string;
};

export type GeneratedQuizResponse = {
  quiz: QuizQuestion[];
};

export type LearningPathQuizStep = {
  id: string;
  learningPathId: string;
  title: string;
  description: string;
  order: number;
};

export type LearningPathQuizMeta = {
  id: string;
  topicId: string;
  title: string;
  description: string;
  status: string;
};

export type GeneratedLearningPathStepQuizResponse = {
  quiz: QuizQuestion[];
  learningPathStep: LearningPathQuizStep;
  learningPath: LearningPathQuizMeta;
};
