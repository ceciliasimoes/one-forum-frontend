import { Topic } from "../../../core/models/topics";

export interface TopicListState {
    list: Topic[],
    loadFlag: boolean,
    errorFlag: boolean,
    totalPages: number,
    totalElements: number
}