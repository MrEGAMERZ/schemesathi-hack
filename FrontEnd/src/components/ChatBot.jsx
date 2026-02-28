import { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { chatbot } from '../services/api';
import './ChatBot.css';

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: '👋 Hi! I\'m your SchemeSathi assistant. Ask me anything about government schemes, eligibility, or how to apply!',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        const query = input.trim();
        if (!query || loading) return;

        setMessages((prev) => [...prev, { role: 'user', text: query }]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatbot(query);
            setMessages((prev) => [...prev, { role: 'bot', text: res.data }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'bot', text: '⚠️ Sorry, I could not process that. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                className={`chatbot-toggle ${open ? 'chatbot-toggle--open' : ''}`}
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle chatbot"
            >
                {open ? <FaTimes /> : <FaCommentDots />}
                {!open && <span className="chatbot-toggle__label">Ask SchemeSathi</span>}
            </button>

            {/* Chat window */}
            {open && (
                <div className="chatbot-window fade-in">
                    <div className="chatbot-header">
                        <div className="chatbot-header__info">
                            <FaRobot className="chatbot-header__icon" />
                            <div>
                                <div className="chatbot-header__name">SchemeSathi AI</div>
                                <div className="chatbot-header__status">Scheme Assistant</div>
                            </div>
                        </div>
                        <button className="chatbot-close" onClick={() => setOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`chatbot-msg chatbot-msg--${m.role}`}>
                                <div className="chatbot-msg__bubble">{m.text}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="chatbot-msg chatbot-msg--bot">
                                <div className="chatbot-msg__bubble chatbot-msg__typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="chatbot-input-row">
                        <input
                            className="input chatbot-input"
                            placeholder="Ask about any scheme..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            disabled={loading}
                        />
                        <button
                            className="chatbot-send"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
