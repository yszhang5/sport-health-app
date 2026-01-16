export type PageParams = {
    page?: number
    pageSize?: number
}

export type PageResponse<T> = {
    list: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

export type Banner = {
    id: string
    image: string
    title: string
    type: 'activity' | 'course' | 'article' | string
    targetId: string
}

export type SportProject = {
    id: string
    name: string
    cover: string
    description: string
    category: string
    difficulty: string
    duration: number
    calories: number
    equipment: string[]
    benefits: string[]
    tags: string[]
}

export type HealthArticle = {
    id: string
    title: string
    cover: string
    summary: string
    content: string
    author: string
    publishTime: string
    views: number
    likes: number
    category: string
    tags: string[]
}

export type Course = {
    id: string
    title: string
    cover: string
    instructor: string
    instructorAvatar: string
    description: string
    type: string
    category: string
    difficulty: string
    duration: number
    price: number
    originalPrice?: number
    students: number
    rating: number
    lessons: number
    isFeatured?: boolean
    tags: string[]
}

export type Venue = {
    id: string
    name: string
    cover: string
    address: string
    distance: string
    rating: number
    price: number
    facilities: string[]
    tags: string[]
}

export type Activity = {
    id: string
    title: string
    cover: string
    type: string
    startTime: string
    endTime: string
    description: string
    rule: string
    reward: {
        type: string
        value: string | number
        name: string
    }
    participants: number
    maxParticipants?: number
    status: string
    tags: string[]
}

export type UserGoal = {
    type: string
    name: string
    icon: string
}
