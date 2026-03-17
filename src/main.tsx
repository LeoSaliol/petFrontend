import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login.tsx';
import { Feed } from './pages/Feed.tsx';
import { Profile } from './pages/Profile.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<App children={<Feed />} />}
                />
                <Route
                    path="/login"
                    element={<App children={<Login />} />}
                />
                <Route
                    path="/profile/:id"
                    element={<App children={<Profile />} />}
                />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
