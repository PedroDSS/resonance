import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { register } from '../services/authService';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from '@tanstack/react-router';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await register(username, password);
            navigate({ to: '/login' });
        } catch (error) {
            console.error('Error while trying to register', error);
            setError('Un problème est survenu lors de l\'inscription.');
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
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gold">Créer un compte</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="text-muted">Nom d'utilisateur</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-secondary text-light border-muted rounded-lg"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-muted">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary text-light border-muted rounded-lg"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-gold text-black font-semibold rounded-lg py-2">
                            S'inscrire
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-muted text-sm">
                            Déjà un compte ?
                            <Link to="/login" className="text-primary hover:text-gold"> Se connecter</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
