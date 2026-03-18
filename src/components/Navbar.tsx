import { Link } from 'react-router';

import { CatPorfileIcon } from '../icons/CatPorfileIcon';
import { NotificationIcon } from '../icons/NotificationIcon';
import { LoginIcon } from '../icons/LoginIcon';
import { useAuth } from '../context/useAuth';
import { logoutUser, myPets } from '../api/axios';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { user, refreshUser } = useAuth();
    const [image, setImage] = useState<string>();

    const loggout = async () => {
        await logoutUser();
        await refreshUser();
    };

    useEffect(() => {
        if (user) {
            const getPet = async () => {
                try {
                    const response = await myPets();
                    const image = response[0]?.image;

                    setImage(image);
                } catch (error) {
                    console.error('Error fetching pets:', error);
                }
            };
            getPet();
        }
    }, [user]);

    return (
        <div className=" sticky top-0 z-10">
            <div className=" flex justify-between items-center">
                <Link
                    to="/"
                    className="font-title text-[2rem] text-primary"
                >
                    Michigram
                </Link>

                <div className="flex gap-5 items-center h-12">
                    <Link to="/">
                        <NotificationIcon
                            width={35}
                            className="pt-1"
                        />
                    </Link>
                    <Link to="/profile/60">
                        {user ? (
                            <img
                                src={image}
                                alt="Pet Profile"
                                className="w-9 h-9 rounded-full mx-auto object-fill  "
                            />
                        ) : (
                            <CatPorfileIcon width={35} />
                        )}
                    </Link>

                    <Link
                        to="/login"
                        onClick={user ? loggout : undefined}
                    >
                        <LoginIcon
                            width={36}
                            className={`pt-1 ${user ? 'stroke-red-600' : 'stroke-[#333] '} `}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
