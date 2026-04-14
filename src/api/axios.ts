import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE,
  withCredentials: true,
});

export default api;

export const getFeed = async (petId: number | undefined) => {
  try {
    const response = await api.get("/posts/feed", {
      params: {
        petId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw error;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    console.log("User logged out successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error logging out user:", error);
  }
};

export const logged = async () => {
  try {
    const response = await api.get("/me");

    return response.data;
  } catch (error) {
    console.error("Error checking logged status:", error);
    return null;
  }
};

export const myPets = async () => {
  try {
    const response = await api.get(`/pets/me`);

    return response.data;
  } catch (error) {
    console.error("Error fetching pets:", error);
    return [];
  }
};

export const createPet = async (name: string, bio: string, image: File) => {
  console.log(name, bio, image);
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  formData.append("image", image);

  try {
    const response = await api.post("/pets", formData);

    return response;
  } catch (error) {
    console.error("Error creating pet:", error);
  }
};

export const createPost = async (
  petId: number | undefined,
  content: string,
  image: File,
) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("image", image);
  formData.append("petId", petId ? petId.toString() : "");
  try {
    const response = await api.post("/posts", formData);

    return response;
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

export const toggleLike = async (postId: number) => {
  try {
    const response = await api.post(`likes/toggle/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling like:", error);
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
    console.error("Error creating comment:", error);
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

export const getPerfil = async (petId: number, userId?: number) => {
  try {
    const response = await api.get(`/users/${petId}/profile`, {
      withCredentials: false,
      params: {
        userId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
};

export const followPet = async (petId: number) => {
  try {
    const response = await api.post(`/follow/${petId}`);

    return response.data;
  } catch (error) {
    console.error("Error following pet:", error);
  }
};

export const getPost = async (postId: number) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

export const deletePost = async (postId: number) => {
  try {
    const response = await api.delete(`/posts/${postId}`);

    return response.data.message;
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};
export const updatePost = async (
  postId: number,
  content: string,
  image: File,
) => {
  const formData = new FormData();
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }
  try {
    const response = await api.put(`/posts/${postId}`, formData);
    console.log(response);
    return response.status;
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

export const updatePet = async (
  name: string,
  bio: string,
  image: File | null,
  petId: number,
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await api.put(`/users/${petId}`, formData);
    return response.status;
  } catch (error) {
    console.error("Error updating pet:", error);
  }
};

export const getNotifications = async (petId: number, limit: number) => {
  try {
    const response = await api.get(`/notifications/${petId}`, {
      params: { limit },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

export const markAsRead = async (notificationId: string) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};
