import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_URL_BASE,
    withCredentials: true,
});

export default api;

export const registerUser = async (
    name: string,
    email: string,
    password: string,
) => {
    api.post('/auth/register', { name, email, password })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error('Error registering user:', error);
        });
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });

        return response;
    } catch (error) {
        console.error('Error logging in user:', error);
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post('/auth/logout');
        console.log('User logged out successfully:', response.data);
        return response;
    } catch (error) {
        console.error('Error logging out user:', error);
    }
};

export const logged = async () => {
    try {
        const response = await api.get('/me');
        return response;
    } catch (error) {
        console.error('Error checking logged status:', error);
    }
};

export const myPets = async () => {
    try {
        const response = await api.get(`/pets/me`);

        return response.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
};

export const createPet = async (name: string, bio: string, image: File) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('image', image);
    try {
        const response = await api.post('/pets', formData);
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error creating pet:', error);
    }
};

export const createPost = async (
    petId: number | undefined,
    content: string,
    image: File,
) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', image);
    formData.append('petId', petId ? petId.toString() : '');
    try {
        const response = await api.post('/posts', formData);

        return response;
    } catch (error) {
        console.error('Error creating post:', error);
    }
};

export const getPosts = async () => {
    try {
        const response = await api.get('/posts/feed');
        const post = response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const postWithLikes = post.map((p: any) => ({
            ...p,
            liked: p.likes.length > 0,
        }));
        return postWithLikes;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

export const toggleLike = async (postId: number, petId: number) => {
    try {
        const response = await api.post(`likes/toggle/${postId}`, { petId });

        return response.data;
    } catch (error) {
        console.error('Error toggling like:', error);
    }
};

export const createComment = async (
    postId: number,
    petId: number,
    content: string,
) => {
    try {
        const response = await api.post(`/comments/${postId}`, {
            petId,
            content,
        });

        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
    }
};

export const getComments = async (postId: number) => {
    try {
        const response = await api.get(`/comments/${postId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
