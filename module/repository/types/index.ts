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
