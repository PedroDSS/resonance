import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { register } from '../services/authService';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from '@tanstack/react-router';

const checkPasswordStrength = (password: string) => {
    return {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
};

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const strength = checkPasswordStrength(password);
    const isPasswordValid = Object.values(strength).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            setError("Le mot de passe ne respecte pas les critères de sécurité.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Adresse email invalide.");
            return;
        }

        try {
            await register(email, password);
            navigate({ to: '/login' });
        } catch (error: any) {
            console.error('Error while trying to register', error);
            const backendMessage = error?.response?.data?.message;
            if (backendMessage) {
                setError(typeof backendMessage === 'string' ? backendMessage : backendMessage[0]);
            } else {
                setError("Un problème est survenu lors de l'inscription.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-light">
            <header className="w-full flex justify-center mt-4">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#A0E9D6] via-[#7BCBFF] via-[#C084FC] via-[#FFD479] to-[#FF7B7B] text-transparent bg-clip-text">
                    Resonance
                </h1>
            </header>
            <Card className="w-full max-w-md bg-tertiary text-light shadow-lg rounded-2xl mt-8">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Créer un compte</h2>
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
                        <div className="text-sm space-y-1">
                            <p className={strength.length ? "text-green-400" : "text-red-500"}>Au moins 8 caractères</p>
                            <p className={strength.lowercase ? "text-green-400" : "text-red-500"}>Une minuscule</p>
                            <p className={strength.uppercase ? "text-green-400" : "text-red-500"}>Une majuscule</p>
                            <p className={strength.number ? "text-green-400" : "text-red-500"}>Un chiffre</p>
                            <p className={strength.specialChar ? "text-green-400" : "text-red-500"}>Un caractère spécial (!@#$...)</p>
                        </div>
                        <Button
                            type="submit"
                            disabled={!isPasswordValid}
                            className="w-full bg-primary hover:bg-gold text-white font-medium rounded-md py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            S'inscrire
                        </Button>
                    </form>
                    <div className="mt-3 text-center">
                        <Link to="/forgot-password" className="text-primary hover:text-gold transition-colors">
                            Mot de passe oublié ?
                        </Link>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-muted text-sm">
                            Déjà un compte ?
                            <Link to="/login" className="text-primary hover:text-gold transition-colors"> Se connecter</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

};

export default Register;
