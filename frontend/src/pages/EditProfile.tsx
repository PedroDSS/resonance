import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const EditProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.username || '');
    const [color, setColor] = useState(user?.color || '#ffffff');
    const [avatar, setAvatar] = useState<File | null>(null);

    if (!user) {
        navigate({ to: '/login' });
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('color', color);
        if (avatar) formData.append('avatar', avatar);

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_SOCKET_URL}/users/me`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setUser(response.data);
            navigate({ to: '/' });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary text-light px-4">
            <div className="bg-tertiary p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <Button
                    onClick={() => navigate({ to: '/' })}
                    className="bg-muted hover:bg-gold mb-4 text-black font-semibold"
                >
                    ← Retour au chat
                </Button>
                <h1 className="text-3xl font-bold mb-6 text-center">Modifier mon profil</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-semibold">Pseudonyme</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 bg-secondary text-light rounded border border-muted"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Couleur de pseudo</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-16 h-10 p-0 border-none bg-transparent"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Photo de profil</label>
                        <div className="relative">
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            <label
                                htmlFor="avatar"
                                className="cursor-pointer inline-block bg-primary text-black font-semibold py-2 px-4 rounded hover:bg-gold transition"
                            >
                                Choisir un fichier
                            </label>
                            {avatar && (
                                <p className="mt-1 text-sm text-muted">{avatar.name}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-gold text-black font-semibold"
                    >
                        Sauvegarder
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
