import { Link } from 'react-router';

import { CatPorfileIcon } from '../icons/CatPorfileIcon';
import { NotificationIcon } from '../icons/NotificationIcon';
import { LoginIcon } from '../icons/LoginIcon';

export default function Navbar() {
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
                        <CatPorfileIcon width={35} />
                    </Link>
                    <Link to="/login">
                        <LoginIcon
                            width={36}
                            className="pt-1"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
