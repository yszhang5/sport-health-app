/**
 * 运动类型枚举
 */
export enum SportType {
    RUNNING = 1,      // 跑步
    WALKING = 2,      // 健走
    CYCLING = 3,      // 骑行
    YOGA = 4,         // 瑜伽
    HIIT = 5,         // 高强度间歇训练
    STRENGTH = 6,     // 力量训练
    SWIMMING = 7,     // 游泳
    BASKETBALL = 8,   // 篮球
    FOOTBALL = 9,     // 足球
    OTHER = 10        // 其他
}

/**
 * 运动记录上传参数
 */
export interface SportRecordParams {
    sportType: number;
    startTime: string; // "YYYY-MM-DD HH:mm:ss"
    endTime: string;
    duration: number;  // 秒
    distance: number;  // 公里
    calories: number;  // 千卡
    steps?: number;    // 步数（可选）
    avgHeartRate?: number; // 平均心率
    maxHeartRate?: number; // 最大心率
    routeData?: string;   // 轨迹数据（JSON字符串）
    weather?: string;      // 天气信息
    notes?: string;       // 备注
}

/**
 * 运动记录视图对象
 */
export interface SportRecordVO {
    recordId: number;
    userId: number;
    sportType: number;
    sportTypeName: string;
    startTime: string;
    endTime: string;
    duration: number;  // 秒
    distance: number;  // 公里
    calories: number;  // 千卡
    steps?: number;
    avgHeartRate?: number;
    maxHeartRate?: number;
    pace?: number;    // 配速（分钟/公里）
    routeData?: string;
    weather?: string;
    notes?: string;
    createdAt: string;
}

/**
 * 运动统计信息
 */
export interface SportStatsVO {
    date: string;           // 日期
    totalDuration: number;  // 总时长（分钟）
    totalCalories: number;  // 总卡路里
    totalDistance: number;  // 总距离（公里）
    workoutCount: number;   // 运动次数
}

/**
 * 运动趋势数据
 */
export interface SportTrendVO {
    period: string;         // 时间段（日/周/月）
    data: SportStatsVO[];   // 统计数据
    summary: {
        totalDuration: number;
        totalCalories: number;
        totalDistance: number;
        avgDuration: number;
        avgCalories: number;
    };
}

/**
 * 排行榜数据
 */
export interface RankVO {
    userId: number;
    nickname: string;
    avatarUrl: string;
    score: number; // 步数、距离或卡路里
    rank: number;
    valueType: 'steps' | 'distance' | 'calories'; // 数值类型
}

/**
 * 运动打卡信息
 */
export interface CheckInVO {
    checkInId: number;
    userId: number;
    recordId?: number;     // 关联的运动记录ID
    checkInDate: string;   // 打卡日期
    sportType: number;
    duration: number;
    calories: number;
    notes?: string;
    images?: string[];      // 图片URL数组
    likes: number;          // 点赞数
    comments: number;       // 评论数
    hasLiked: boolean;      // 当前用户是否点赞
}

/**
 * 运动目标设置
 */
export interface SportGoalVO {
    goalId: number;
    userId: number;
    goalType: 'daily' | 'weekly' | 'monthly'; // 目标类型
    targetType: 'steps' | 'distance' | 'calories' | 'workouts'; // 目标指标
    targetValue: number;    // 目标值
    currentValue: number;   // 当前值
    startDate: string;
    endDate: string;
    progress: number;       // 进度百分比
    achieved: boolean;
}