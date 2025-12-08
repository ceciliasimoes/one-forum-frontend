export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  updateAt: string;
  profile: Profile;
  emailVerified: boolean;
  locked: boolean;
  deleted: boolean;
}

export interface Profile {
  name: string;
  photo: string;
}

export interface UserEditRequest {
    name?: string | null;
    photo?: string | null;
}
