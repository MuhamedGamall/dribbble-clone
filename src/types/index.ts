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
  image: string;
  ProjectUrl: string;
  githubUrl: string;
  category: string;
  _id: string;
  createdBy: {
    name: string;
    email: string;
    avatarUrl: string;
    id: string;
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
