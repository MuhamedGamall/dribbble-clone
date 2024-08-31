export interface ProjectInterface {
  title: string;
  description: string;
  posterUrl: string;
  posterId: string;
  projectUrl: string;
  githubUrl: string;
  likesCount: number;
  viewership: number;
  isFavorite: boolean;
  category: string;
  _id: string;
  creator: {
    name: string;
    email: string;
    avatarUrl: string;
    _id: string;
  };
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  description: string | null;
  avatarUrl: string;
  githubUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  following: string[];
  followersCount: number;
  isFollowed: boolean;
  seeing: string[];
  projects: string[];
  favorites: string[];
}

export interface ProjectForm {
  title: string;
  description: string;
  image: string;
  ProjectUrl: string;
  githubUrl: string;
  category: string;
}

export interface CurrentSession {
  user: UserProfile;
  expires: Date;
}
