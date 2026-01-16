import service from '@/utils/request';
import type { Result } from '@/utils/request';
import type { CourseVO, CourseDetailVO, CourseSearchParams } from './model/courseModel';

enum Api {
    List = '/courses/list',
    Detail = '/courses',
}

export const getCourseListApi = (params?: CourseSearchParams) => {
    return service.get<any, Result<CourseVO[]>>(Api.List, { params });
};

export const getCourseDetailApi = (courseId: number) => {
    return service.get<any, Result<CourseDetailVO>>(`${Api.Detail}/${courseId}`);
};

/**
 * 获取热门课程
 */
export const getPopularCoursesApi = (limit: number = 10) => {
    return service.get<any, Result<CourseVO[]>>('/courses/popular', { params: { limit } });
};

/**
 * 获取推荐课程
 */
export const getRecommendedCoursesApi = (limit: number = 10) => {
    return service.get<any, Result<CourseVO[]>>('/courses/recommended', { params: { limit } });
};

/**
 * 获取我管理的课程（管理员）
 */
export const getMyManagedCoursesApi = () => {
    return service.get<any, Result<CourseVO[]>>('/courses/my/managed');
};
