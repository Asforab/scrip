import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a URL to analyze or ask a question..."
          className="flex-1 p-3 rounded-lg bg-gray-700/50 text-gray-100 border border-gray-600/50 
                     focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none 
                     transition-colors placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors 
                   duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">↻</span>
              <span>Processing...</span>
            </>
          ) : (
            <span>Send</span>
          )}
        </button>
      </div>
    </form>
  );
}
