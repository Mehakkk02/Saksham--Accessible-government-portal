/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';
import { speakText, stopSpeaking } from '../utils/speech';
import { t } from '../utils/i18n';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AskSakshamChat() {
  const { language, highContrast } = useSakshamStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHi = language === 'hi';

  // Set initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: t('chat.initialGreeting', language),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Client-side strict PII sanitizer
  const sanitizeQueryBeforeSending = (text: string): string => {
    let cleaned = text;
    // Strip 12-digit patterns (Aadhaar)
    cleaned = cleaned.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[number removed]');
    // Strip 10-digit phone numbers
    cleaned = cleaned.replace(/\b[6-9]\d{9}\b/g, '[phone removed]');
    // Strip email addresses
    cleaned = cleaned.replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[email removed]');
    return cleaned.trim();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    if (!rawText.trim() || isLoading) return;

    const sanitizedText = sanitizeQueryBeforeSending(rawText);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setAriaAnnouncement(isHi ? 'सक्षम उत्तर तैयार कर रहा है' : 'Saksham is preparing an answer');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: sanitizedText,
          language,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        (isHi
          ? 'UDID आवेदन पूर्णतः मुफ़्त है। कृपया आधिकारिक पोर्टल swavlambancard.gov.in पर देखें।'
          : 'UDID application is 100% free. Please check official portal swavlambancard.gov.in.');

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setAriaAnnouncement(`Saksham: ${replyText}`);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: isHi
          ? 'सर्वर से संपर्क करने में समस्या हुई। कृपया swavlambancard.gov.in पर आधिकारिक जानकारी देखें।'
          : 'Could not connect to server. Please check swavlambancard.gov.in for official information.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
      return;
    }

    setSpeakingMsgId(msgId);
    speakText(text, {
      lang: language,
      onEnd: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null),
    });
  };

  const sampleQuestions = isHi
    ? [
        'क्या UDID कार्ड का आवेदन मुफ़्त है?',
        'मुझे कौन से दस्तावेज़ चाहिए?',
        'अस्पताल में क्या होता है?',
      ]
    : [
        'Is the UDID application free?',
        'What documents are required?',
        'What happens at the hospital?',
      ];

  return (
    <>
      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite">
        {ariaAnnouncement}
      </div>

      {/* Floating Action Launcher Button (Positioned at bottom-left to prevent overlap with Voice Assistant at bottom-right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t('chat.floatingBtn', language)}
          className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 ${
            highContrast
              ? 'bg-yellow-400 text-slate-950 font-black border-2 border-yellow-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white font-bold'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-bold tracking-tight">{t('chat.floatingBtn', language)}</span>
        </button>
      )}

      {/* Slide-over / Modal Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-heading"
          className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-50 w-[calc(100vw-24px)] sm:w-[420px] max-h-[85vh] h-[580px] flex flex-col rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div
            className={`p-3.5 sm:p-4 border-b flex items-center justify-between ${
              highContrast
                ? 'bg-slate-950 text-white border-yellow-400/40'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 id="chat-heading" className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {t('chat.title', language)}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('chat.subtitle', language)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setSpeakingMsgId(null);
                setIsOpen(false);
              }}
              aria-label={t('qc.close', language)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy & Anti-Fraud Notice */}
          <div className="bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 px-3 py-1.5 flex items-center gap-2 text-[11px] text-blue-900 dark:text-blue-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{t('chat.privacyNote', language)}</span>
          </div>

          {/* Message History */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSpeakingThis = speakingMsgId === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium'
                        : highContrast
                        ? 'bg-slate-800 text-yellow-300 border border-yellow-400/50 rounded-bl-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Actions for Assistant replies */}
                  {!isUser && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        aria-label={isSpeakingThis ? t('qc.stopVoice', language) : t('chat.readAloud', language)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {isSpeakingThis ? (
                          <VolumeX className="w-3 h-3 text-red-500" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{isSpeakingThis ? t('qc.stopVoice', language) : t('chat.readAloud', language)}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs text-slate-500 font-medium">
                  {t('chat.thinking', language)}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Mandatory AI Disclaimer */}
          <div className="px-3 py-1 bg-amber-50/70 dark:bg-amber-950/30 border-t border-amber-100 dark:border-amber-900/40 flex items-center gap-1.5 text-[10px] text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="truncate">{t('chat.disclaimer', language)}</span>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chat.placeholder', language)}
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              aria-label={t('chat.send', language)}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
