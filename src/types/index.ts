export interface Pet {
    id: number;
    name: string;
    image: string;
}

export interface Post {
    id: number;
    image: string;
    content?: string;
    createdAt: string;
    pet: Pet;
    _count: {
        likes: number;
        comments: number;
    };
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}
