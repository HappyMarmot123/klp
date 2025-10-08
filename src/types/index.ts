export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  images?: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  Profile: { userId: string };
};
