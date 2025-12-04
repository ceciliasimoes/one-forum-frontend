import { TopicCategory } from "./topics";

export interface TopicCard {
    id: number;
    title: string;
    likes: number;
    content: string | null;
    likedByCurrentUser: boolean;
    user: any;
    createdAt: Date;
    updatedAt: Date;
    categories: TopicCategory[];
}