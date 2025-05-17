import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';

type Message = {
    id: number;
    message: string;
    timestamp: string;
    sender: {
        id: number;
        username: string;
        color: string;
        avatar?: string;
    };
};

const emojiList = [
    { name: 'smile', emoji: '😊' },
    { name: 'grin', emoji: '😀' },
    { name: 'joy', emoji: '😂' },
    { name: 'heart_eyes', emoji: '😍' },
    { name: 'cry', emoji: '😭' },
    { name: 'sunglasses', emoji: '😎' },
    { name: 'angry', emoji: '😡' },
    { name: 'partying_face', emoji: '🥳' },
    { name: 'thumbs_up', emoji: '👍' },
    { name: 'fire', emoji: '🔥' },
    { name: 'heart', emoji: '❤️' },
];

const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isSameDay = (a: Date, b: Date) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const time = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    if (isSameDay(date, now)) {
        return time;
    } else if (isSameDay(date, yesterday)) {
        return `Hier à ${time}`;
    } else {
        const formattedDate = date.toLocaleDateString('fr-FR');
        return `${formattedDate} ${time}`;
    }
};

const Chat = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [socket, setSocket] = useState<any>(null);
    const [typingUsers, setTypingUsers] = useState<{ id: number; username: string }[]>([]);
    const [showEmojis, setShowEmojis] = useState(false);
    const [emojiSuggestions, setEmojiSuggestions] = useState<{ name: string; emoji: string }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const typingTimeouts = useRef<{ [key: number]: NodeJS.Timeout }>({});

    if (!user) {
        navigate({ to: '/login' });
        return null;
    }

    useEffect(() => {
        const socketIo = io(import.meta.env.VITE_SOCKET_URL, {
            query: { token: localStorage.getItem('token') },
        });

        setSocket(socketIo);

        socketIo.on('connect', () => console.log('Connected to WebSocket'));

        socketIo.on('message_history', (history: Message[]) => {
            setMessages(history);
        });

        socketIo.on('message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        socketIo.on('typing', (typingUser: { id: number; username: string }) => {
            if (typingUser.id !== user.id) {
                setTypingUsers((prev) => {
                    if (!prev.some((u) => u.id === typingUser.id)) {
                        return [...prev, typingUser];
                    }
                    return prev;
                });

                clearTimeout(typingTimeouts.current[typingUser.id]);
                typingTimeouts.current[typingUser.id] = setTimeout(() => {
                    setTypingUsers((prev) => prev.filter((u) => u.id !== typingUser.id));
                    delete typingTimeouts.current[typingUser.id];
                }, 400);
            }
        });

        socketIo.on('disconnect', () => console.log('Disconnected from WebSocket'));

        return () => socketIo.disconnect();
    }, [user]);

    const handleSendMessage = () => {
        if (message.trim() && socket) {
            socket.emit('message', { message });
            setMessage('');
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, typingUsers]);

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessage(value);

        if (socket) {
            socket.emit('typing', { id: user.id, username: user.username });
        }

        const match = value.match(/:([a-zA-Z0-9_+-]*)$/);
        if (match) {
            const query = match[1];
            const suggestions = emojiList.filter((emoji) => emoji.name.startsWith(query));
            setEmojiSuggestions(suggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleEmojiAutocomplete = (emoji: string) => {
        const newMessage = message.replace(/:([a-zA-Z0-9_+-]*)$/, `${emoji} `);
        setMessage(newMessage);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && message.trim()) {
            e.preventDefault();
            handleSendMessage();
        }

        if (e.key === 'Tab' && showSuggestions && emojiSuggestions.length > 0) {
            e.preventDefault();
            handleEmojiAutocomplete(emojiSuggestions[0].emoji);
        }
    };

    useEffect(() => {
        const match = message.match(/:([a-zA-Z0-9_+-]+):/);
        if (match) {
            const found = emojiList.find((e) => e.name === match[1]);
            if (found) {
                setMessage((prev) => prev.replace(`:${match[1]}:`, found.emoji));
            }
        }
    }, [message]);

    return (
        <div className="min-h-screen bg-secondary text-light p-4">
            <header className="w-full flex justify-center mt-4">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#A0E9D6] via-[#7BCBFF] via-[#C084FC] via-[#FFD479] to-[#FF7B7B] text-transparent bg-clip-text">
                    Resonance
                </h1>
            </header>
            <div className="max-w-4xl mx-auto mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        Bienvenue, <span className="text-gold">{capitalize(user.username)}</span>
                    </h2>
                    <div className="flex gap-3">
                        <Button onClick={() => navigate({ to: '/edit-profile' })} className="bg-muted hover:bg-gold text-black font-semibold rounded-md">
                            Modifier mon profil
                        </Button>
                        <Button onClick={logout} className="bg-primary hover:bg-gold text-black font-semibold rounded-md">
                            Déconnexion
                        </Button>
                    </div>
                </div>
                <div className="bg-tertiary p-4 rounded-2xl shadow-inner text-muted h-128 overflow-y-auto flex flex-col">
                    <div className="flex-1">
                        {messages.length === 0 ? (
                            <p className="text-center text-muted">Il n'y a aucun message...</p>
                        ) : (
                            messages.map((msg) => {
                                const avatarUrl = msg.sender?.avatar
                                    ? `${import.meta.env.VITE_SOCKET_URL}/uploads/avatars/${msg.sender.avatar}`
                                    : '/default-avatar.png';
                                return (
                                    <div key={msg.id} className="mb-4 flex items-start gap-3">
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full object-cover border border-muted"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold">
                                                <span style={{ color: msg.sender?.color || '#fd6c9e' }}>
                                                    {msg.sender?.username}
                                                    {msg.sender?.id === user.id && ' (Vous)'}
                                                </span>{' '}
                                                <span className="text-xs text-gray-400">
                                                    {formatMessageDate(msg.timestamp)}
                                                </span>
                                            </p>
                                            <p className="text-light">{msg.message}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div style={{ minHeight: '24px' }}>
                            {typingUsers.length > 0 && (
                                <div className="text-sm text-muted italic">
                                    {typingUsers.map((u) => u.username).join(', ')} est en train d’écrire...
                                </div>
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="mt-2 flex items-center relative">
                    <input
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full p-3 bg-secondary text-light border border-muted rounded-lg"
                        placeholder="Écrivez votre message..."
                    />
                    <div className="relative ml-2">
                        <button
                            type="button"
                            onClick={() => setShowEmojis((prev) => !prev)}
                            className="text-2xl hover:scale-110 transition-transform"
                        >
                            😊
                        </button>
                        {showEmojis && (
                            <div className="absolute bottom-full right-0 mb-2 z-10 p-3 bg-secondary border border-muted rounded-lg shadow-md w-64 grid grid-cols-5 gap-4">
                                {emojiList.map(({ name, emoji }) => (
                                    <button
                                        key={name}
                                        type="button"
                                        className="text-2xl hover:scale-110 transition-transform"
                                        title={`:${name}:`}
                                        onClick={() => {
                                            setMessage((prev) => prev + emoji);
                                            setShowEmojis(false);
                                        }}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {showSuggestions && emojiSuggestions.length > 0 && (
                        <div className="absolute bottom-full left-0 mb-2 z-10 p-2 bg-secondary border border-muted rounded-lg shadow-md max-w-xs">
                            {emojiSuggestions.map(({ name, emoji }) => (
                                <button
                                    key={name}
                                    type="button"
                                    className="block w-full text-left text-light hover:bg-muted p-1 rounded"
                                    onClick={() => handleEmojiAutocomplete(emoji)}
                                >
                                    {emoji} :{name}:
                                </button>
                            ))}
                        </div>
                    )}
                    <Button
                        onClick={handleSendMessage}
                        className="ml-2 bg-primary hover:bg-gold text-black font-semibold py-2 px-6 rounded-lg"
                    >
                        Envoyer
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
