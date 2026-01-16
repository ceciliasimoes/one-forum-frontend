export interface CreateComment {
  content: string;
}

// export interface Comment {
//   id: number;
//   content: string;
//   user: {
//     id: number;
//     username: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

export interface CommentAuthor {
  id: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  topicId: number;
  author: CommentAuthor;
  userProfileName: string;
  userProfilePhoto?: string;
  content: string;
  createdAt: string;
}