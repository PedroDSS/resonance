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
    const [avatarError, setAvatarError] = useState<string | null>(null);

    if (!user) {
        navigate({ to: '/login' });
        return null;
    }

    const handleAvatarChange = (file: File | null) => {
        setAvatar(null);
        setAvatarError(null);

        if (!file) return;

        if (file.size > 500 * 1024) {
            setAvatarError('L’image dépasse 500 Ko. Merci d’en choisir une plus légère.');
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            if (img.width > 256 || img.height > 256) {
                setAvatarError('L’image dépasse 256x256 pixels. Elle ne sera pas acceptée.');
                URL.revokeObjectURL(objectUrl);
                return;
            }

            setAvatar(file);
            setAvatarError(null);
            URL.revokeObjectURL(objectUrl);
        };

        img.onerror = () => {
            setAvatarError('Impossible de lire l’image.');
            URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (avatarError) return;

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
        <div className="min-h-screen flex flex-col justify-center items-center bg-secondary text-light px-4 py-12">
            <h1 className="text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#A0E9D6] via-[#7BCBFF] via-[#C084FC] via-[#FFD479] to-[#FF7B7B] text-transparent bg-clip-text">
                Resonance
            </h1>
            <div className="bg-tertiary p-8 rounded-2xl shadow-xl w-full max-w-md">
                <Button
                    onClick={() => navigate({ to: '/' })}
                    className="bg-muted hover:bg-gold mb-4 text-black font-semibold rounded-md"
                >
                    ← Retour au chat
                </Button>
                <h2 className="text-center text-3xl font-bold mb-6">Modifier mon profil</h2>
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
                            className="w-16 h-10 p-0 border-none bg-transparent cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Photo de profil</label>
                        <div className="relative">
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            <label
                                htmlFor="avatar"
                                className="cursor-pointer inline-block bg-primary text-black font-semibold py-2 px-4 rounded hover:bg-gold transition"
                            >
                                Choisir un fichier
                            </label>
                            {avatar && !avatarError && (
                                <p className="mt-1 text-sm text-muted">{avatar.name}</p>
                            )}
                            {avatarError && (
                                <p className="mt-1 text-sm text-red-500 font-medium">{avatarError}</p>
                            )}
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-gold text-black font-semibold"
                        disabled={!!avatarError}
                    >
                        Sauvegarder
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
