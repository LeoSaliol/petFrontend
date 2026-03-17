import { useParams } from 'react-router-dom';

export const Profile = () => {
    const id = useParams().id;
    return <>Profile numero {id}</>;
};
