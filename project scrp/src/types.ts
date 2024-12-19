export interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  error?: boolean;
}
