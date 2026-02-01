import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    hospital_name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: {
                id: 0,
                username: 'Guest',
                email: 'guest@example.com',
                role: 'admin',
                hospital_name: 'General Hospital'
            },
            token: 'dummy-token',
            setAuth: (user, token, refreshToken) => {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                set({ user, token });
            },
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                set({ user: null, token: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
