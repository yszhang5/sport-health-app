/**
 * 用户登录参数
 */
export interface LoginParams {
    mobile: string;
    password?: string;
    // code?: string; // 如果有验证码登录
}

/**
 * 用户注册参数
 */
export interface RegisterParams {
    mobile: string;
    password?: string;
    nickname: string;
    gender: number; // 1:男, 2:女, 3:沃尔玛购物袋
}

/**
 * 用户档案更新参数
 */
export interface UpdateProfileParams {
    nickname?: string;
    gender?: number;      // 1:男, 2:女
    birthday?: string;    // yyyy-MM-dd
    height?: number;
    weight?: number;
    goalType?: number;    // 1:减脂, 2:增肌, 3:塑形
    activityLevel?: number; // 1:低, 2:中, 3:高
}

/**
 * 完整用户档案视图对象
 */
export interface UserProfileVO {
    userId: number;
    nickname: string;
    avatarUrl: string;
    gender: number; // 1:男, 2:女
    mobile: string;
    birthday?: string;
    height?: number;
    weight?: number;
    goalType?: number;    // 1:减脂, 2:增肌, 3:塑形
    activityLevel?: number; // 1:低, 2:中, 3:高
    userCourse?: number[]; // 用户学习的课程ID列表
}

/**
 * 用户基础信息（用于列表展示）
 */
export interface UserBasicVO {
    userId: number;
    nickname: string;
    avatarUrl: string;
    gender: number;
}

/**
 * 排行榜用户信息
 */
export interface RankUserVO {
    userId: number;
    nickname: string;
    avatarUrl: string;
    score: number; // 步数或其他积分
    rank: number;  // 排名
}

/**
 * 用户统计信息
 */
export interface UserStatsVO {
    totalWorkouts: number;      // 总运动次数
    totalDuration: number;      // 总运动时长（分钟）
    totalCalories: number;     // 总消耗卡路里
    currentStreak: number;      // 当前连续打卡天数
    longestStreak: number;     // 最长连续打卡天数
}

/**
 * 用户成就信息
 */
export interface UserAchievementVO {
    achievementId: number;
    name: string;
    description: string;
    iconUrl: string;
    achieved: boolean;
    achievedAt?: string;
    progress?: number;        // 进度百分比
    targetValue?: number;     // 目标值
    currentValue?: number;    // 当前值
}