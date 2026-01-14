import type { UserProfileVO } from '../api/model/userModel'

export interface UserState {
    token: string
    userInfo: UserProfileVO | null
}