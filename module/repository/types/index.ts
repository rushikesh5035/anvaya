export type RepositoryListItem = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  isPrivate: boolean;
  isConnected: boolean;
};

export type ConnectRepositoryInput = {
  owner: string;
  name: string;
  githubId: number;
};

export type ConnectRepositoryResult = {
  repositoryId: string;
  fullName: string;
  alreadyConnected: boolean;
};
