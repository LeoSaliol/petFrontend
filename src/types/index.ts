export type Pet = {
    id: number;
    ownerId: number;
    createdAT: string;
    name: string;
    image: string;
    bio: string;
};

export interface Post {
    id: number;
    content: string;
    image: string;
    createdAt: string;
    likes: number[];
    pet: {
        id: number;
        name: string;
        image: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    likedByUser?: boolean;
    newComment?: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}
