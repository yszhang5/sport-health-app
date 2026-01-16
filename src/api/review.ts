import { request } from '../utils/request'
import type { Result } from '../utils/request'
import type { CourseReviewVO } from './model/courseModel'
import type { VenueReviewVO } from './model/venueModel'

/**
 * 创建课程评价参数
 */
export interface CourseReviewCreateParams {
    rating: number // 1-5
    content?: string
}

/**
 * 创建场馆评价参数
 */
export interface VenueReviewCreateParams {
    rating: number // 1-5
    content?: string
}

/**
 * 创建课程评价
 */
export const createCourseReviewApi = (courseId: number, params: CourseReviewCreateParams) => {
    return request.post<any, Result<number>>(`/courses/${courseId}/reviews`, params)
}

/**
 * 获取课程评价列表
 */
export const getCourseReviewsApi = (courseId: number, params?: { page?: number; size?: number }) => {
    return request.get<any, Result<CourseReviewVO[]>>(`/courses/${courseId}/reviews`, { params })
}

/**
 * 获取我的课程评价
 */
export const getMyCourseReviewApi = (courseId: number) => {
    return request.get<any, Result<CourseReviewVO>>(`/courses/${courseId}/reviews/my`)
}

/**
 * 删除课程评价
 */
export const deleteCourseReviewApi = (courseId: number, reviewId: number) => {
    return request.delete<any, Result<null>>(`/courses/${courseId}/reviews/${reviewId}`)
}

/**
 * 创建场馆评价
 */
export const createVenueReviewApi = (venueId: number, params: VenueReviewCreateParams) => {
    return request.post<any, Result<number>>(`/venues/${venueId}/reviews`, params)
}

/**
 * 获取场馆评价列表
 */
export const getVenueReviewsApi = (venueId: number, params?: { page?: number; size?: number }) => {
    return request.get<any, Result<VenueReviewVO[]>>(`/venues/${venueId}/reviews`, { params })
}

/**
 * 获取我的场馆评价
 */
export const getMyVenueReviewApi = (venueId: number) => {
    return request.get<any, Result<VenueReviewVO>>(`/venues/${venueId}/reviews/my`)
}

/**
 * 删除场馆评价
 */
export const deleteVenueReviewApi = (venueId: number, reviewId: number) => {
    return request.delete<any, Result<null>>(`/venues/${venueId}/reviews/${reviewId}`)
}
