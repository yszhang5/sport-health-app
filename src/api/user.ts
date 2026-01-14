import service from '@/utils/request';
import type { Result } from '@/utils/request';
import type { LoginParams, RegisterParams, UserProfileVO, UpdateProfileParams } from './model/userModel';

enum Api {
    Login = '/users/login',
    Register = '/users/register',
    Profile = '/users/profile',
    AddCourse = '/users/courses',
}

export const loginApi = (params: LoginParams) => {
    return service.post<any, Result<string>>(Api.Login, params);
};

export const registerApi = (params: RegisterParams) => {
    return service.post<any, Result<number>>(Api.Register, params);
};

export const getUserProfileApi = () => {
    return service.get<any, Result<UserProfileVO>>(Api.Profile);
};

export const updateUserProfileApi = (params: UpdateProfileParams) => {
    return service.put<any, Result<null>>(Api.Profile, params);
};

export const addCourseToUserApi = (courseId: number) => {
    return service.post<any, Result<null>>(`${Api.AddCourse}/${courseId}`);
};