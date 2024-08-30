import { User, Session } from "next-auth";

export type FormState = {
  title: string;
  description: string;
  image: string;
  ProjectUrl: string;
  githubUrl: string;
  category: string;
};

export interface ProjectInterface {
  title: string;
  description: string;
  likesCount: number;
  posterUrl: string;
  posterId: string;
  projectUrl: string;
  githubUrl: string;
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
  linkedinUrl: string | null;
  projects: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface ProjectForm {
  title: string;
  description: string;
  image: string;
  ProjectUrl: string;
  githubUrl: string;
  category: string;
}
