import { Pageable } from "./pageable.model";

export interface TopicQueryEntity {
  categoryId: number | null,
  searchInput: string,
  authorId: number | null,
  moreLiked: boolean,
  pageable: Pageable
}
