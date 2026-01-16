export interface TopicCategory {
  name: string;
}

export interface TopicUser {
  id: number;
  createdAt: string;
  profileName: string;
  profilePhoto?: string;
}

export interface Topic {
  id: number;
  title: string;
  likes: number;
  content: string | null;
  likedByCurrentUser: boolean;
  author: TopicUser;
  createdAt: string;
  updatedAt: string;
  categories: string[];
}

export interface TopicCreateRequest {
  title: string;
  content: string;
  categories: string[];
}

export interface TopicEditRequest {
  title?: string | null;
  content?: string | null;
}

export interface UpdateTopicRequest {
  title?: string | null;
  content?: string | null;
}
