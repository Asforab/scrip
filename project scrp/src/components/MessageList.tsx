import { useState, useEffect, useRef, memo } from 'react';
import { Message } from '../types';
import { VirtualScroller } from './VirtualScroller';
import { measurePerformance } from '../utils/performance';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList = memo(({ messages, isLoading }: MessageListProps) => {
  const [performance, setPerformance] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const metrics = measurePerformance();
    setPerformance(metrics);
  }, [messages]);

  const renderMessage = (message: Message) => (
    <div
      className={`message ${message.role} ${
        performance?.ttfb > 1000 ? 'optimized' : ''
      }`}
    >
      <div className="message-content">{message.content}</div>
      <div className="message-meta">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="message-container h-[600px] overflow-hidden"
    >
      <VirtualScroller
        items={messages}
        itemHeight={100}
        overscan={5}
        renderItem={renderMessage}
      />
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
});

MessageList.displayName = 'MessageList';
