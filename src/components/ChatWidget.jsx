import React, { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../api/client';
import { Bot, X, Send, MessageCircle } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 0, role: 'assistant', text: 'Namaskaram! I am FarmThozhan. Ask me anything about your farm expenses or agricultural advice.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messageIdCounter, setMessageIdCounter] = useState(1);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        const userMsgId = messageIdCounter;
        setMessageIdCounter(prev => prev + 1);
        setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await aiAPI.chat(userMessage);
            const assistantMsgId = messageIdCounter + 1;
            setMessageIdCounter(prev => prev + 2);
            if (response.success) {
                setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', text: response.response }]);
            } else {
                setMessages(prev => [...prev, { id: assistantMsgId, role: 'error', text: 'Hmm, I encountered an issue. Try again.' }]);
            }
        } catch (err) {
            const errorMsgId = messageIdCounter + 1;
            setMessageIdCounter(prev => prev + 2);
            setMessages(prev => [...prev, { id: errorMsgId, role: 'error', text: 'Network error. Could not reach FarmThozhan.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* ── Floating trigger button ─────────────── */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    title="Chat with FarmThozhan AI"
                    className="chat-fab"
                    style={{
                        position: 'fixed',
                        bottom: 'calc(var(--mobile-nav-height) + env(safe-area-inset-bottom) + 12px)',   /* above mobile bottom nav */
                        right: '16px',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 16px rgba(74,158,63,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 1100,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(74,158,63,0.55)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,158,63,0.45)';
                    }}
                >
                    <Bot size={24} />
                </button>
            )}

            {/* ── Chat panel ──────────────────────────── */}
            {isOpen && (
                <div
                    className="chat-panel"
                    style={{
                        position: 'fixed',
                        bottom: 'calc(var(--mobile-nav-height) + env(safe-area-inset-bottom) + 12px)',   /* matches button offset */
                        right: '16px',
                        width: 'min(360px, calc(100vw - 32px))',
                        height: 'min(500px, calc(100vh - 150px))',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1100,
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                        backgroundColor: 'var(--bg-card)',
                        animation: 'slideUpChat 0.2s ease-out',
                    }}
                >
                    <style>{`
                        @keyframes slideUpChat {
                            from { opacity: 0; transform: translateY(12px) scale(0.97); }
                            to   { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        /* On desktop, offset from the right edge of the sidebar too */
                        @media (min-width: 768px) {
                            .chat-panel-inner { bottom: 28px !important; right: 28px !important; }
                        }
                    `}</style>

                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                        color: 'white',
                        padding: '0.875rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: 30, height: 30, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bot size={17} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>FarmThozhan AI</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Smart farming assistant</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                borderRadius: '50%',
                                width: 28, height: 28,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '0.875rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.625rem',
                        backgroundColor: 'var(--bg-main)',
                    }}>
                        {messages.map((m) => (
                            <div key={m.id} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor:
                                    m.role === 'user' ? 'var(--primary-color)'
                                    : m.role === 'error' ? 'var(--accent-red)'
                                    : 'white',
                                color: m.role === 'user' || m.role === 'error' ? 'white' : 'var(--text-dark)',
                                padding: '0.625rem 0.875rem',
                                borderRadius: '14px',
                                borderBottomRightRadius: m.role === 'user' ? '4px' : '14px',
                                borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '14px',
                                maxWidth: '85%',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                fontSize: '0.85rem',
                                lineHeight: 1.5,
                            }}>
                                <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }} />
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{
                                alignSelf: 'flex-start',
                                backgroundColor: 'white',
                                padding: '0.625rem 0.875rem',
                                borderRadius: '14px',
                                borderBottomLeftRadius: '4px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                display: 'flex', gap: '4px', alignItems: 'center',
                            }}>
                                {[0, 1, 2].map(i => (
                                    <div key={`dot-${i}`} style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: 'var(--primary-color)',
                                        animation: `bounce 1s ${i * 0.2}s infinite`,
                                    }} />
                                ))}
                                <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSend}
                        style={{
                            padding: '0.75rem',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: '0.5rem',
                            backgroundColor: 'white',
                            flexShrink: 0,
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask about your farm..."
                            style={{
                                flex: 1,
                                padding: '0.5rem 0.875rem',
                                borderRadius: '20px',
                                border: '1.5px solid var(--border-color)',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !input.trim()}
                            style={{
                                background: input.trim() ? 'var(--primary-color)' : 'var(--border-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px', height: '36px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: input.trim() ? 'pointer' : 'default',
                                transition: 'background 0.2s',
                                flexShrink: 0,
                            }}
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
