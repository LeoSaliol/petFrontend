import { Link } from 'react-router';

import { CatPorfileIcon } from '../icons/CatPorfileIcon';
import { NotificationIcon } from '../icons/NotificationIcon';
import { LoginIcon } from '../icons/LoginIcon';
import { useAuth } from '../context/useAuth';
import { logoutUser } from '../api/axios';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { userToken, pet, refreshUser } = useAuth();
    const [scroll, setScroll] = useState(false);

    const loggout = async () => {
        await logoutUser();
        await refreshUser();
    };
    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div className=" sticky top-0  ">
            <div className=" flex justify-between items-center">
                <Link
                    to="/"
                    className={`font-title text-[2.2rem] text-primary ${scroll ? 'backdrop-blur-xs 2xl:backdrop-blur-none 2xl:-translate-x-55 2:xltext-[2rem]' : ''} transition-all duration-700 ease-in-out `}
                >
                    Michigram
                </Link>

                <div
                    className={
                        'flex gap-5 items-center h-12 transition-all duration-700 ease-in-out  ' +
                        (scroll
                            ? 'backdrop-blur-xs 2xl:backdrop-blur-none  2xl:translate-x-45'
                            : '')
                    }
                >
                    <Link to="/">
                        <NotificationIcon
                            width={35}
                            className="pt-1"
                        />
                    </Link>
                    <Link to="/profile/60">
                        {userToken ? (
                            <img
                                src={pet?.image}
                                alt="Pet Profile"
                                className="w-9 h-9 rounded-full mx-auto object-fill  "
                            />
                        ) : (
                            <CatPorfileIcon width={35} />
                        )}
                    </Link>

                    <Link
                        to="/login"
                        onClick={userToken ? loggout : undefined}
                    >
                        <LoginIcon
                            width={36}
                            className={`pt-1 ${userToken ? 'stroke-red-600' : 'stroke-[#333] '} `}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
