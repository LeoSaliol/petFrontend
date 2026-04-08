import { useState } from 'react';

export const useTheme = () => {
    const getInitialTheme = (): 'light' | 'dark' => {
        const savedTheme = localStorage.getItem('theme');

        if (
            savedTheme === 'dark' ||
            (!savedTheme &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            return 'dark';
        }

        return 'light';
    };

    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

    // 🔥 SOLO sincronizamos con el DOM (esto sí es correcto)
    const applyTheme = (newTheme: 'light' | 'dark') => {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    return { theme, toggleTheme };
};
