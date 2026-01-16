/**
 * 场馆类型枚举
 */
export enum VenueType {
    GYM = 1,           // 健身房
    YOGA_STUDIO = 2,   // 瑜伽馆
    SWIMMING_POOL = 3, // 游泳馆
    SPORTS_FIELD = 4,  // 运动场
    DANCE_STUDIO = 5,  // 舞蹈室
    OTHER = 6          // 其他
}

/**
 * 场馆基本信息
 */
export interface VenueVO {
    venueId: number;
    name: string;
    typeId: number;
    typeName: string;
    address: string;
    contactPhone: string;
    rating: number;
    reviewCount: number;
    distance?: number;      // 距离（公里）
    businessHours?: string; // 营业时间
    facilities?: string[];   // 设施列表
    images?: string[];       // 场馆图片
    description?: string;    // 场馆描述
    coverImage?: string;     // 封面图片
    isFavorite?: boolean;    // 是否收藏
}

/**
 * 场馆详情信息
 */
export interface VenueDetailVO extends VenueVO {
    introduction: string;           // 详细介绍
    amenities: string[];           // 便利设施
    rules: string[];              // 场馆规则
    notice?: string;              // 特别通知
    latitude?: number;            // 纬度
    longitude?: number;           // 经度
    openingHours: OpeningHour[];  // 详细营业时间
}

/**
 * 营业时间
 */
export interface OpeningHour {
    dayOfWeek: number;    // 1-7 代表周一到周日
    openTime: string;     // "09:00"
    closeTime: string;    // "22:00"
    isOpen: boolean;      // 是否营业
}

/**
 * 场馆搜索参数
 */
export interface VenueSearchParams {
    typeId?: number;           // 场馆类型
    name?: string;             // 场馆名称关键词
    minRating?: number;        // 最低评分
    maxDistance?: number;      // 最大距离（公里）
    facilities?: string[];      // 所需设施
    sortBy?: 'distance' | 'rating' | 'reviewCount'; // 排序方式
    sortOrder?: 'asc' | 'desc'; // 排序顺序
}

/**
 * 场馆评论信息
 */
export interface VenueReviewVO {
    reviewId: number;
    userId: number;
    nickname: string;
    avatarUrl: string;
    rating: number;
    content: string;
    images?: string[];
    createdAt: string;
    helpfulCount: number;
    isHelpful?: boolean; // 当前用户是否觉得有用
}

/**
 * 场馆课程信息
 */
export interface VenueCourseVO {
    courseId: number;
    name: string;
    coachName: string;
    coachAvatar?: string;
    duration: number;        // 时长（分钟）
    difficulty: number;      // 难度等级 1-5
    calories: number;        // 预估卡路里消耗
    price: number;          // 价格
    schedule: CourseSchedule[]; // 课程安排
    availableSpots: number;  // 剩余名额
    isBookable: boolean;     // 是否可预约
}

/**
 * 课程安排
 */
export interface CourseSchedule {
    scheduleId: number;
    date: string;           // 日期
    startTime: string;      // 开始时间
    endTime: string;        // 结束时间
    available: boolean;     // 是否可预约
    bookedCount: number;    // 已预约人数
}