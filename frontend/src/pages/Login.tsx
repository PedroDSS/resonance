import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from '@tanstack/react-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await login(email, password);
            setUser(data.user);
            localStorage.setItem('token', data.access_token);
            navigate({ to: '/chat' });
        } catch (error) {
            console.error('Error while trying to connect', error);
            setError("L'adresse email ou le mot de passe est incorrect.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-light">
            <header className="w-full">
                <h1 className="text-center text-4xl font-extrabold text-light">
                    Resonance
                </h1>
            </header>

            <Card className="w-full max-w-md bg-tertiary text-light shadow-lg rounded-lg mt-8">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gold">Se connecter</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gold mb-1">Adresse email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-secondary text-light border-muted rounded-lg"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-gold mb-1">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary text-light border-muted rounded-lg"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-gold text-black font-semibold rounded-lg py-2">
                            Se connecter
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-muted text-sm">
                            Pas encore inscrit ?
                            <Link to="/register" className="text-primary hover:text-gold"> Créez un compte</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
