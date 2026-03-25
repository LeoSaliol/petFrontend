import { Link } from 'react-router';

import { CatPorfileIcon } from '../icons/CatPorfileIcon';
import { NotificationIcon } from '../icons/NotificationIcon';
import { LoginIcon } from '../icons/LoginIcon';
import { useAuth } from '../context/useAuth';
import { logoutUser } from '../api/axios';

export default function Navbar() {
    const { userToken, pet, refreshUser } = useAuth();

    const loggout = async () => {
        await logoutUser();
        await refreshUser();
    };

    return (
        <div className=" sticky top-0 ">
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
