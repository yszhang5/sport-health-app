import { request } from '../utils/request'
import type { Result } from '../utils/request'

/**
 * 创建预约参数
 */
export interface BookingCreateParams {
    venueId: number
    courseId?: number
    bookingTime: string // "YYYY-MM-DD HH:mm:ss"
}

/**
 * 预约视图对象
 */
export interface BookingVO {
    bookingId: number
    userId: number
    venueId: number
    venueName: string
    courseId?: number
    courseTitle?: string
    bookingTime: string
    status: number // 0:待确认, 1:已确认, 2:已完成, 3:已取消
    createdAt: string
}

/**
 * 更新预约状态参数
 */
export interface BookingStatusParams {
    status: number
}

/**
 * 创建预约
 */
export const createBookingApi = (params: BookingCreateParams) => {
    return request.post<any, Result<number>>('/bookings', params)
}

/**
 * 获取我的预约列表
 */
export const getMyBookingsApi = () => {
    return request.get<any, Result<BookingVO[]>>('/bookings/my')
}

/**
 * 获取场馆预约列表（管理员）
 */
export const getVenueBookingsApi = (venueId: number) => {
    return request.get<any, Result<BookingVO[]>>(`/bookings/venue/${venueId}`)
}

/**
 * 获取预约详情
 */
export const getBookingDetailApi = (bookingId: number) => {
    return request.get<any, Result<BookingVO>>(`/bookings/${bookingId}`)
}

/**
 * 更新预约状态
 */
export const updateBookingStatusApi = (bookingId: number, params: BookingStatusParams) => {
    return request.put<any, Result<null>>(`/bookings/${bookingId}/status`, params)
}

/**
 * 取消预约
 */
export const cancelBookingApi = (bookingId: number) => {
    return request.delete<any, Result<null>>(`/bookings/${bookingId}`)
}
