import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from '@tanstack/react-router';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post(`${import.meta.env.VITE_SOCKET_URL}/auth/forgot-password`, { email });
            setSuccess("Un email de réinitialisation a été envoyé.");
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Erreur lors de l'envoi de l'email.";
            setError(typeof msg === 'string' ? msg : msg[0]);
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
                    <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Mot de passe oublié</h2>

                    {error && <p className="text-error text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}

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
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-gold text-white font-medium rounded-md py-2 transition-colors"
                        >
                            Envoyer le lien
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-muted text-sm">
                            Vous vous souvenez de votre mot de passe ?
                            <Link to="/login" className="text-primary hover:text-gold transition-colors"> Se connecter</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

};

export default ForgotPassword;
