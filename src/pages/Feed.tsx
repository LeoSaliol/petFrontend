import { CreatePostButton } from '../components/ButtonPost';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/useAuth';

export const Feed = () => {
    const { userToken } = useAuth();
    return (
        <>
            {userToken && <CreatePostButton />}

            <PostCard />
        </>
    );
};
