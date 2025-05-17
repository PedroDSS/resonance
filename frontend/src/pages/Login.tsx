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
            <header className="w-full flex justify-center mt-4">
                <h1
                    className="text-4xl font-extrabold bg-gradient-to-r from-[#A0E9D6] via-[#7BCBFF] via-[#C084FC] via-[#FFD479] to-[#FF7B7B] text-transparent bg-clip-text"
                >
                    Resonance
                </h1>
            </header>

            <Card className="w-full max-w-md bg-tertiary text-light shadow-lg rounded-2xl mt-8">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Se connecter</h2>
                    {error && <p className="text-error text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-muted mb-1">Adresse email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-secondary text-light border border-muted focus:border-primary rounded-md"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-muted mb-1">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary text-light border border-muted focus:border-primary rounded-md"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-gold text-white font-medium rounded-md py-2 transition-colors"
                        >
                            Se connecter
                        </Button>
                    </form>
                    <div className="mt-3 text-center">
                        <Link to="/forgot-password" className="text-primary hover:text-gold transition-colors">
                            Mot de passe oublié ?
                        </Link>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-muted text-sm">
                            Pas encore inscrit ?
                            <Link to="/register" className="text-primary hover:text-gold transition-colors"> Créez un compte</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
};

export default Login;
