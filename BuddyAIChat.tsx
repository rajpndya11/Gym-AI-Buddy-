import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, ArrowRight, CornerDownLeft, Zap } from 'lucide-react';
import { AIChatMessage, UserProfile } from '../types';

interface BuddyAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onActionTrigger?: (actionType: string, payload?: any) => void;
}

export const BuddyAIChat: React.FC<BuddyAIChatProps> = ({
  isOpen,
  onClose,
  user,
  onActionTrigger,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'buddy',
      text: `Hey ${user.name || 'Raj'} 👋 What can I help with today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'What should I do today?',
    'How do I perform this exercise?',
    'What weight should I use?',
    'Can I replace this exercise?',
    "I'm feeling low on energy today",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendPrompt = (promptText: string) => {
    const userMsg: AIChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate actionable intelligent response
    setTimeout(() => {
      let replyText = '';
      let actions: AIChatMessage['actions'] = [];

      const lower = promptText.toLowerCase();
      if (lower.includes('today') || lower.includes('what should i do')) {
        replyText = `Based on your ${user.goal.toLowerCase()} goal and 4-day plan, today is an Upper Body session (~42 min) focusing on chest press, lat pulldowns, and arm accessories.`;
        actions = [
          {
            label: 'Start Today’s Workout →',
            actionType: 'start_workout',
          },
        ];
      } else if (lower.includes('replace') || lower.includes('instead of') || lower.includes('chest press')) {
        replyText = 'You can use a Chest Press machine today. It trains a similar movement pattern and is much easier to control with built-in safety stops.';
        actions = [
          {
            label: 'Use Chest Press Machine →',
            actionType: 'replace_exercise',
            payload: { exerciseId: 'chest_press_machine' },
          },
        ];
      } else if (lower.includes('energy') || lower.includes('tired') || lower.includes('low')) {
        replyText = 'Showing up when tired is the real win. Let’s swap today for a quick 20-minute ease-in session so you keep your momentum without wearing yourself out.';
        actions = [
          {
            label: 'Switch to 20-Min Session →',
            actionType: 'switch_short_workout',
          },
        ];
      } else if (lower.includes('weight') || lower.includes('how heavy')) {
        replyText = 'Start with a weight where rep 8 feels solid, but you know you could still complete 2 more reps if asked. For your level, 35–40 kg is a sweet spot.';
        actions = [
          {
            label: 'Set Target to 35 kg →',
            actionType: 'reduce_weight',
            payload: 35,
          },
        ];
      } else if (lower.includes('perform') || lower.includes('form') || lower.includes('technique')) {
        replyText = 'Keep your shoulder blades pinched and stable, lower the weight in 2 controlled seconds, and avoid bouncing at the bottom.';
        actions = [
          {
            label: 'Show Visual Form Loop →',
            actionType: 'show_form_tip',
          },
        ];
      } else {
        replyText = `I hear you! As a beginner, keeping movements steady and controlled is your highest leverage habit. I've noted this in your session profile.`;
      }

      const buddyMsg: AIChatMessage = {
        id: 'buddy-' + Date.now(),
        sender: 'buddy',
        text: replyText,
        timestamp: 'Just now',
        actions,
      };

      setMessages((prev) => [...prev, buddyMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: NonNullable<AIChatMessage['actions']>[number]) => {
    if (onActionTrigger) {
      onActionTrigger(action.actionType, action.payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md h-[90vh] sm:h-[680px] bg-[#101010] border border-[#262626] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden"
        id="buddy-chat-drawer"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#171717] border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-[#202020] border border-[#333] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#C7FF3D]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#C7FF3D] ring-2 ring-[#101010] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-[#F5F5F5] text-sm">GymBuddy AI</h3>
                <span className="text-[10px] bg-[#C7FF3D]/15 text-[#C7FF3D] font-bold px-1.5 py-0.5 rounded">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-[#8A8A8A]">Your knowledgeable gym companion</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#222222] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#222] text-[#F5F5F5] border border-[#333] rounded-br-none'
                    : 'bg-[#171717] text-[#F5F5F5] border border-[#262626] rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {/* Action Buttons if available */}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2.5 space-y-1.5 w-full max-w-[85%]">
                  {m.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(act)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf335] active:scale-[0.99] text-black font-bold text-xs flex items-center justify-between transition-all shadow-md shadow-[#C7FF3D]/10"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#171717] border border-[#262626] max-w-[80px]">
              <span className="w-2 h-2 rounded-full bg-[#C7FF3D] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#C7FF3D] animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#C7FF3D] animate-bounce [animation-delay:0.3s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="px-4 py-2 bg-[#141414] border-t border-[#222] overflow-x-auto scrollbar-none flex gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendPrompt(prompt)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-[#1c1c1c] hover:bg-[#252525] text-[#8A8A8A] hover:text-[#F5F5F5] border border-[#2c2c2c] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#171717] border-t border-[#262626]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputValue.trim()) {
                handleSendPrompt(inputValue.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about today's workout..."
              className="flex-1 bg-[#101010] border border-[#2b2b2b] focus:border-[#C7FF3D] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F5F5] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf335] disabled:opacity-40 disabled:hover:bg-[#C7FF3D] text-black font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
