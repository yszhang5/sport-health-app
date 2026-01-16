import { request } from '../utils/request'
import type { Result } from '../utils/request'

/**
 * 积分记录视图对象
 */
export interface PointRecordVO {
    recordId: number
    points: number // 正数为获得，负数为消耗
    type: string // 类型：sport, share, activity, exchange
    typeName: string // 类型名称
    description: string // 描述
    createdAt: string
}

/**
 * 积分规则视图对象
 */
export interface PointRuleVO {
    rules: Array<{
        type: string
        typeName: string
        description: string
        points: number
    }>
}

/**
 * 获取积分记录
 */
export const getPointRecordsApi = (params?: {
    type?: string
    startDate?: string
    endDate?: string
}) => {
    return request.get<any, Result<PointRecordVO[]>>('/points/records', { params })
}

/**
 * 获取积分规则
 */
export const getPointRulesApi = () => {
    return request.get<any, Result<PointRuleVO>>('/points/rules')
}
