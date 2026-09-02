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

export type DisconnectRepositoryInput = {
  githubId: number;
};

export type DisconnectRepositoryResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export type DisconnectAllRepositoriesResult =
  | {
      success: true;
      count: number;
      message: string;
    }
  | {
      success: false;
      message: string;
    };
