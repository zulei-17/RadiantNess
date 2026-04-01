export type Mood = "great" | "good" | "okay" | "low" | "bad";

export interface MoodEntry {
  id: string;
  mood: Mood;
  timestamp: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  author: string;
  color: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}
