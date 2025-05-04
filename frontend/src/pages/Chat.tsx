import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';

type Message = {
    id: number;
    message: string;
    username: string;
    timestamp: string;
    sender: {
        id: number;
        username: string;
        color: string;
    };
};

const Chat = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [socket, setSocket] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    if (!user) {
        navigate({ to: '/login' });
        return null;
    }

    useEffect(() => {
        const socketIo = io(import.meta.env.VITE_SOCKET_URL, {
            query: { token: localStorage.getItem('token') },
        });

        setSocket(socketIo);

        socketIo.on('connect', () => {
            console.log('Connected to the WebSocket server');
        });

        socketIo.on('message_history', (history: Message[]) => {
            setMessages(history);
        });

        socketIo.on('message', (msg: Message) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socketIo.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            socketIo.disconnect();
        };
    }, [user]);

    const handleSendMessage = () => {
        if (message.trim() && socket) {
            socket.emit('message', { message });
            setMessage('');
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-secondary text-light p-4">
            <header className="w-full">
                <h1 className="text-center text-4xl font-extrabold text-light">Resonance</h1>
            </header>
            <div className="max-w-4xl mx-auto mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        Bienvenue, <span className="text-gold">{user.username}</span>
                    </h1>
                    <div className="flex space-x-4">
                        <Button
                            onClick={() => navigate({ to: '/edit-profile' })}
                            className="bg-muted hover:bg-gold text-black font-semibold"
                        >
                            Modifier mon profil
                        </Button>
                        <Button onClick={logout} className="bg-primary hover:bg-gold text-black font-semibold">
                            Déconnexion
                        </Button>
                    </div>
                </div>

                <div className="bg-tertiary p-4 rounded-lg shadow-inner text-muted h-128 overflow-y-auto">
                    {messages.length === 0 ? (
                        <p className="text-center text-muted">Il n'y a aucun message...</p>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className="mb-4">
                                <p className="text-sm font-semibold">
                                    <span style={{ color: msg.sender?.color || '#fd6c9e' }}>
                                        {msg.sender?.username}
                                        {msg.sender?.id === user.id && ' (Vous)'}
                                    </span>{' '}
                                    <span className="text-xs text-gray-400">
                                        ({new Date(msg.timestamp).toLocaleTimeString()})
                                    </span>
                                </p>
                                <p className="text-light">{msg.message}</p>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex items-center">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && message.trim()) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        className="w-full p-3 bg-secondary text-light border-muted rounded-lg"
                        placeholder="Ecrivez votre message.."
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="ml-4 bg-primary hover:bg-gold text-black font-semibold py-2 px-6 rounded-lg"
                    >
                        Envoyer
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
