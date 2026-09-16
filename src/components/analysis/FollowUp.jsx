import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bot, User } from 'lucide-react';
import { getFollowUpResponse } from '../../services/analysisService';
import './FollowUp.css';

const SUGGESTED_QUESTIONS = [
  'Why is vegetation higher here?',
  'Show detected buildings.',
  'Explain the confidence score.',
];

/**
 * FollowUp — Chat interface for follow-up questions after analysis
 */
export default function FollowUp({ analysisResult }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (question) => {
    const q = (question ?? input).trim();
    if (!q || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getFollowUpResponse(q, analysisResult);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sq-followup">
      <div className="sq-followup__header">
        <h2 className="sq-followup__title">
          <span className="sq-followup__icon" aria-hidden="true">
            <MessageSquare size={12} />
          </span>
          Continue Exploring
        </h2>
        <span className="sq-followup__subtitle">Explore the analysis with follow-up questions.</span>
      </div>

      {/* Suggested questions — only when no messages yet */}
      {messages.length === 0 && (
        <div className="sq-followup__suggestions" aria-label="Suggested questions">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className="sq-followup__suggestion"
              onClick={() => handleSend(q)}
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Conversation area */}
      {messages.length > 0 && (
        <div className="sq-followup__messages" aria-live="polite" aria-label="Conversation">
          {messages.map((msg) => (
            <div key={msg.id} className={`sq-followup__msg sq-followup__msg--${msg.role}`}>
              <span className="sq-followup__msg-avatar" aria-hidden="true">
                {msg.role === 'user' ? <User size={11} /> : <Bot size={11} />}
              </span>
              <p className="sq-followup__msg-text">{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="sq-followup__msg sq-followup__msg--assistant sq-followup__msg--typing">
              <span className="sq-followup__msg-avatar" aria-hidden="true"><Bot size={11} /></span>
              <div className="sq-followup__typing" aria-label="AI is typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input row */}
      <div className="sq-followup__input-row">
        <input
          ref={inputRef}
          type="text"
          className="sq-followup__input"
          placeholder="Ask a follow-up about this analysis..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Follow-up question input"
          id="followup-input"
          maxLength={500}
        />
        <button
          type="button"
          className="sq-followup__send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          aria-label="Send follow-up question"
          id="followup-send-btn"
        >
          {isLoading ? (
            <span className="sq-followup__send-spinner" aria-hidden="true" />
          ) : (
            <Send size={13} />
          )}
        </button>
      </div>
    </div>
  );
}
