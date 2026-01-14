import { defineStore } from 'pinia'
import { loginApi, registerApi, getUserProfileApi, updateUserProfileApi } from '../api/user'
import type { LoginParams, RegisterParams, UserProfileVO, UpdateProfileParams } from '../api/model/userModel'
import type { UserState } from './types'

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: localStorage.getItem('token') || '',
        userInfo: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(loginParams: LoginParams): Promise<boolean> {
            try {
                const res = await loginApi(loginParams)
                if (res.code === 200) {
                    this.token = res.data
                    localStorage.setItem('token', res.data)
                    await this.getProfile()
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Login failed:', error)
                throw error // 抛出错误，让调用方处理
            }
        },

        async register(registerParams: RegisterParams): Promise<boolean> {
            try {
                const res = await registerApi(registerParams)
                return res.code === 200
            } catch (error: any) {
                console.error('Register failed:', error)
                throw error // 抛出错误，让调用方处理
            }
        },

        async getProfile(): Promise<void> {
            try {
                const res = await getUserProfileApi()
                if (res.code === 200) {
                    this.userInfo = res.data
                }
            } catch (error) {
                console.error('Get profile failed:', error)
            }
        },

        async updateProfile(profileParams: UpdateProfileParams): Promise<boolean> {
            try {
                const res = await updateUserProfileApi(profileParams)
                if (res.code === 200) {
                    await this.getProfile()
                    return true
                }
                return false
            } catch (error) {
                console.error('Update profile failed:', error)
                return false
            }
        },

        logout(): void {
            this.token = ''
            this.userInfo = null
            localStorage.removeItem('token')
        }
    }
})