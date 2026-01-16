import { request } from '../utils/request'
import type { Result } from '../utils/request'

/**
 * 运动成就视图对象
 */
export interface AchievementVO {
    totalDistance: number // 总里程（公里）
    completedCourses: number // 完成课程数
    consecutiveDays: number // 连续坚持天数
    totalPoints: number // 总积分
    currentPoints: number // 当前可用积分
}

/**
 * 获取我的运动成就
 */
export const getMyAchievementsApi = () => {
    return request.get<any, Result<AchievementVO>>('/achievements/my')
}
