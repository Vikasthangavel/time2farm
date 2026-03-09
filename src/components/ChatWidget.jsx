import React, { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../api/client';
import { Bot, X, Send } from 'lucide-react';
import Card from './Card';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Namaskaram! I am FarmThozhan. Ask me anything about your farm expenses or agricultural advice.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await aiAPI.chat(userMessage);
            if (response.success) {
                setMessages(prev => [...prev, { role: 'assistant', text: response.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'error', text: 'Hmm, I encountered an issue. Try again.' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'error', text: 'Network error. Could not reach FarmThozhan.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="animate-slide-up"
                style={{
                    display: isOpen ? 'none' : 'flex',
                    position: 'absolute',
                    bottom: '80px',
                    right: '16px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    boxShadow: 'var(--shadow-lg)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >
                <Bot size={24} />
            </button>

            {isOpen && (
                <Card
                    padding="0"
                    style={{
                        position: 'absolute',
                        bottom: '75px',
                        right: '10px',
                        width: 'calc(100% - 20px)',
                        maxWidth: '360px',
                        height: '460px',
                        maxHeight: 'calc(100vh - 120px)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1001,
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    {/* Header */}
                    <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bot size={20} />
                            <span style={{ fontWeight: '600' }}>FarmThozhan AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#f9fafb' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: m.role === 'user' ? 'var(--primary-color)' : m.role === 'error' ? 'var(--accent-red)' : 'white',
                                color: m.role === 'user' || m.role === 'error' ? 'white' : 'var(--text-dark)',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                borderBottomRightRadius: m.role === 'user' ? '4px' : '12px',
                                borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '12px',
                                maxWidth: '85%',
                                boxShadow: 'var(--shadow-sm)',
                                fontSize: '0.875rem',
                                lineHeight: 1.4
                            }}>
                                <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }} />
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '0.75rem', borderRadius: '12px', maxWidth: '85%', boxShadow: 'var(--shadow-sm)' }}>
                                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', backgroundColor: 'white' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border-color)', outline: 'none' }}
                        />
                        <button
                            type="submit"
                            disabled={isTyping}
                            style={{
                                backgroundColor: input.trim() ? 'var(--primary-color)' : '#9ca3af',
                                color: 'white', border: 'none', borderRadius: '50%',
                                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: input.trim() ? 'pointer' : 'default',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </Card>
            )}
        </>
    );
};

export default ChatWidget;
