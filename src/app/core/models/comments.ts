export interface CreateComment {
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AnsWer {
  id: number;
  topicId: number;
  userId: number;

  userProfileName: string;
  userProfilePhoto: string;

  content: string;
  createdAt: string;
  updateAt: string;
}