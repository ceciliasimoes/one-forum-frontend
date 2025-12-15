export interface TopicListQueryEntity {
  category?: number,
  search?: string,
  authorId?: number,
  moreLiked?: boolean,
  page?: number,
  size?: number,
  sort?: string[]
}

export interface HomeTopicListQueryEntity {
  category?: number,
  search?: string,
  mine?: boolean,
  moreLiked?: boolean,
  page?: number,
  size?: number,
  sort?: string[]
}

