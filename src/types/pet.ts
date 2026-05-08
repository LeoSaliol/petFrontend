export interface Pet {
  id: number;
  ownerId: number;
  createdAT: string;
  name: string;
  image: string;
  bio: string;
}

export interface PetMini {
  id: number;
  name: string;
  image: string;
}

export interface CreatePetPayload {
  name: string;
  image?: string | File;
  bio?: string;
}