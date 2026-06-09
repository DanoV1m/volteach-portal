export interface Institution {
  key: string;
  name: string;
  fullName: string;
  location: string;
  emoji: string;
  type: 'uni' | 'college';
  moodleUrl: string;
  driveId: string;
  programs: string[];
}

export interface Course {
  icon: string;
  title: string;
  subtitle: string;
  topics: string[];
}

export interface YoutubeLink {
  title: string;
  channel: string;
  url: string;
  emoji: string;
}

export interface ResourceLink {
  icon: string;
  title: string;
  desc: string;
  url: string;
}

export interface CourseEnrichment {
  description: string;
  syllabus: string[];
  youtube: YoutubeLink[];
  links: ResourceLink[];
}

export interface TopicKnowledge {
  course: string;
  explain: string;
  formula: string;
  example: string;
  quizQuestion: string;
  quizAnswer: string;
}

export interface NotebookData {
  notes: string;
  formulas: string;
}

export interface FormulaBookmark {
  id: string;
  title: string;
  latex: string;
}
