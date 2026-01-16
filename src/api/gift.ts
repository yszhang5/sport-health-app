import { request } from '../utils/request'
import type { Result } from '../utils/request'

/**
 * 礼品视图对象
 */
export interface GiftVO {
    giftId: number
    name: string
    description: string
    image: string
    points: number // 所需积分
    type: string // 类型：physical, virtual, app_benefit
    typeName: string // 类型名称：实物、虚拟服务、APP权益
    stock: number // 库存
    status: number // 状态：0:下架, 1:上架
}

/**
 * 兑换礼品参数
 */
export interface GiftExchangeParams {
    giftId: number
    address?: string // 实物商品需要
    contactPhone?: string // 实物商品需要
}

/**
 * 礼品兑换记录视图对象
 */
export interface GiftExchangeVO {
    exchangeId: number
    giftId: number
    giftName: string
    giftImage: string
    points: number
    status: number // 0:待发货, 1:已发货, 2:已完成, 3:已取消
    address?: string
    contactPhone?: string
    createdAt: string
}

/**
 * 获取礼品列表
 */
export const getGiftListApi = (params?: {
    type?: string
    status?: number
    sortBy?: 'points_asc' | 'points_desc'
}) => {
    return request.get<any, Result<GiftVO[]>>('/gifts/list', { params })
}

/**
 * 获取礼品详情
 */
export const getGiftDetailApi = (giftId: number) => {
    return request.get<any, Result<GiftVO>>(`/gifts/${giftId}`)
}

/**
 * 兑换礼品
 */
export const exchangeGiftApi = (params: GiftExchangeParams) => {
    return request.post<any, Result<number>>('/gifts/exchange', params)
}

/**
 * 获取我的兑换记录
 */
export const getMyExchangesApi = () => {
    return request.get<any, Result<GiftExchangeVO[]>>('/gifts/my/exchanges')
}
