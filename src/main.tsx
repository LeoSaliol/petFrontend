import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login.tsx';
import { Feed } from './pages/Feed.tsx';
import { Profile } from './pages/Profile.tsx';
import Register from './pages/Register.tsx';
import Pet from './pages/Pet.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';

import { ProtectedLayout } from './routes/ProtectedLayout.tsx';
import { CreatePost } from './pages/CreatePost.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<App children={<Feed />} />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/profile/:id"
                        element={<App children={<Profile />} />}
                    />
                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route element={<ProtectedLayout />}>
                        <Route
                            path="/create-post"
                            element={<App children={<CreatePost />} />}
                        />
                        <Route
                            path="/pets"
                            element={<App children={<Pet />} />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);
