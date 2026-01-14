/**
 * 课程类型枚举
 */
export enum CourseType {
    ONLINE_VIDEO = 1,    // 线上视频课程
    OFFLINE_CLASS = 2,   // 线下预约课程
    LIVE_STREAMING = 3   // 直播课程
}

/**
 * 课程难度枚举
 */
export enum CourseDifficulty {
    BEGINNER = 1,    // 入门
    INTERMEDIATE = 2, // 进阶
    ADVANCED = 3     // 专业
}

/**
 * 课程基本信息
 */
export interface CourseVO {
    courseId: number;
    title: string;
    type: number;
    typeName: string;
    difficulty: number;
    difficultyName: string;
    duration: number;        // 时长（分钟）
    caloriesBurn: number;    // 预估消耗卡路里
    coverImage: string;      // 封面图片
    previewUrl?: string;     // 预览视频URL
    price: number;          // 价格（0表示免费）
    originalPrice?: number; // 原价
    rating: number;         // 评分
    reviewCount: number;    // 评论数
    studentCount: number;   // 学习人数
    isPurchased?: boolean;  // 是否已购买
    isFavorite?: boolean;   // 是否收藏
    venueId?: number;       // 所属场馆ID（仅线下课程）
    venueName?: string;     // 场馆名称
}

/**
 * 课程详情信息
 */
export interface CourseDetailVO extends CourseVO {
    instructor: InstructorVO;   // 讲师信息
    description: string;        // 课程描述
    objectives: string[];       // 学习目标
    requirements: string[];     // 课程要求
    sections: CourseSection[];  // 课程章节
    reviews: CourseReviewVO[];  // 课程评价
    relatedCourses: CourseVO[]; // 相关课程
}

/**
 * 讲师信息
 */
export interface InstructorVO {
    instructorId: number;
    name: string;
    avatar: string;
    title: string;           // 头衔/职称
    experience: string;      // 教学经验
    specialty: string[];      // 专业领域
    introduction: string;     // 个人介绍
    rating: number;          // 讲师评分
}

/**
 * 课程章节
 */
export interface CourseSection {
    sectionId: number;
    title: string;
    order: number;
    duration: number;
    lessons: CourseLesson[];
}

/**
 * 课程课时
 */
export interface CourseLesson {
    lessonId: number;
    title: string;
    order: number;
    duration: number;
    videoUrl?: string;       // 视频URL
    isPreview: boolean;      // 是否可预览
    isCompleted?: boolean;   // 是否已完成
}

/**
 * 课程评价
 */
export interface CourseReviewVO {
    reviewId: number;
    userId: number;
    nickname: string;
    avatarUrl: string;
    rating: number;
    content: string;
    createdAt: string;
    helpfulCount: number;
    isHelpful?: boolean;
}

/**
 * 课程搜索参数
 */
export interface CourseSearchParams {
    type?: number;           // 课程类型
    difficulty?: number;     // 难度等级
    venueId?: number;        // 场馆ID
    categoryId?: number;     // 分类ID
    priceRange?: [number, number]; // 价格范围
    keyword?: string;        // 关键词搜索
    sortBy?: 'popular' | 'newest' | 'rating' | 'price';
    sortOrder?: 'asc' | 'desc';
}

/**
 * 学习进度
 */
export interface LearningProgressVO {
    courseId: number;
    progress: number;        // 总体进度百分比
    completedLessons: number; // 已完成课时数
    totalLessons: number;    // 总课时数
    lastStudyTime?: string;  // 最后学习时间
    currentLesson?: number;  // 当前学习课时
    studyDuration: number;   // 总学习时长（分钟）
}

/**
 * 课程分类
 */
export interface CourseCategoryVO {
    categoryId: number;
    name: string;
    icon: string;
    courseCount: number;
    subCategories?: CourseCategoryVO[]; // 子分类
}