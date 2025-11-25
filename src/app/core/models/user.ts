export interface User {
  id: number;
  createdAt: string;
  profileName: string;
  profilePhoto: string;
}

export interface UserEditRequest {
    name?: string | null;
    photo?: string | null;
}
