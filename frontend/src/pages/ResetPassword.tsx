import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const checkPasswordStrength = (password: string) => ({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const search = useSearch({ from: '/reset-password' });
    const token = search.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const strength = checkPasswordStrength(password);
    const isPasswordValid = Object.values(strength).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError("Lien invalide ou expiré.");
            return;
        }

        if (!isPasswordValid) {
            setError("Le mot de passe ne respecte pas les critères de sécurité.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_SOCKET_URL}/auth/reset-password`, {
                token,
                newPassword: password,
            });

            setSuccess("Mot de passe réinitialisé avec succès. Vous allez être redirigé...");
            setTimeout(() => navigate({ to: '/login' }), 3000);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Erreur inconnue.";
            setError(typeof msg === 'string' ? msg : msg[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-light">
            <header className="w-full">
                <h1 className="text-center text-4xl font-extrabold text-light">Resonance</h1>
            </header>

            <Card className="w-full max-w-md bg-tertiary text-light shadow-lg rounded-lg mt-8">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gold">Réinitialiser le mot de passe</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="password" className="text-gold mb-1">Nouveau mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary text-light border-muted rounded-lg"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className="text-gold mb-1">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-secondary text-light border-muted rounded-lg"
                            />
                        </div>

                        <div className="text-sm space-y-1">
                            <p className={strength.length ? "text-green-500" : "text-red-500"}>Au moins 8 caractères</p>
                            <p className={strength.lowercase ? "text-green-500" : "text-red-500"}>Une minuscule</p>
                            <p className={strength.uppercase ? "text-green-500" : "text-red-500"}>Une majuscule</p>
                            <p className={strength.number ? "text-green-500" : "text-red-500"}>Un chiffre</p>
                            <p className={strength.specialChar ? "text-green-500" : "text-red-500"}>Un caractère spécial (!@#$...)</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={!isPasswordValid}
                            className="w-full bg-primary hover:bg-gold text-black font-semibold rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Réinitialiser
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
