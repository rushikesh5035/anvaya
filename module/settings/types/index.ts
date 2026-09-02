export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
};

export type UpdateUserProfileInput = {
  name: string;
};

export type UpdateUserProfileResult =
  | {
      success: true;
      user: Pick<UserProfile, "id" | "name" | "email">;
    }
  | {
      success: false;
      message: string;
    };

export type ConnectedRepository = {
  id: string;
  name: string;
  fullName: string;
  url: string;
  createdAt: Date;
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
