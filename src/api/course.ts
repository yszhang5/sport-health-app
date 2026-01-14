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

