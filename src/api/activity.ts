import { request } from '../utils/request'
import type { Result } from '../utils/request'

/**
 * 活动视图对象
 */
export interface ActivityVO {
    activityId: number
    title: string
    description: string
    coverImage: string
    type: string // 类型：online, offline, challenge, checkin
    typeName: string // 类型名称：线上、线下、挑战赛、打卡任务
    startTime: string
    endTime: string
    rewardPoints: number // 奖励积分
    status: number // 状态：0:未开始, 1:进行中, 2:已结束
    participantCount: number // 参与人数
    isJoined: boolean // 是否已报名
}

/**
 * 活动详情视图对象
 */
export interface ActivityDetailVO extends ActivityVO {
    userProgress?: number // 用户完成进度（0-100）
    userStatus?: number // 用户状态：0:未报名, 1:已报名, 2:进行中, 3:已完成
}

/**
 * 更新活动进度参数
 */
export interface ActivityProgressParams {
    progress: number // 0-100
}

/**
 * 获取活动列表
 */
export const getActivityListApi = (params?: {
    type?: string
    status?: number
}) => {
    return request.get<any, Result<ActivityVO[]>>('/activities/list', { params })
}

/**
 * 获取活动详情
 */
export const getActivityDetailApi = (activityId: number) => {
    return request.get<any, Result<ActivityDetailVO>>(`/activities/${activityId}`)
}

/**
 * 报名活动
 */
export const joinActivityApi = (activityId: number) => {
    return request.post<any, Result<null>>(`/activities/${activityId}/join`)
}

/**
 * 更新活动进度
 */
export const updateActivityProgressApi = (activityId: number, params: ActivityProgressParams) => {
    return request.put<any, Result<null>>(`/activities/${activityId}/progress`, params)
}
