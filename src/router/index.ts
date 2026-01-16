import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/home/HomePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/auth/LoginPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../pages/auth/RegisterPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/sport/record',
        name: 'SportRecord',
        component: () => import('../pages/sport/SportRecordPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/sport/history',
        name: 'SportHistory',
        component: () => import('../pages/sport/SportHistoryPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/sport/rank',
        name: 'SportRank',
        component: () => import('../pages/sport/RankPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/venues',
        name: 'VenueList',
        component: () => import('../pages/discovery/VenueListPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/venues/:venueId',
        name: 'VenueDetail',
        component: () => import('../pages/discovery/VenueDetailPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/courses',
        name: 'CourseList',
        component: () => import('../pages/discovery/CourseListPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/courses/:courseId',
        name: 'CourseDetail',
        component: () => import('../pages/discovery/CourseDetailPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../pages/mine/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/edit',
        name: 'ProfileEdit',
        component: () => import('../pages/mine/ProfileEditPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/community',
        name: 'Community',
        component: () => import('../pages/discovery/index.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/bookings',
        name: 'MyBookings',
        component: () => import('../pages/booking/MyBookingsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/bookings/create',
        name: 'BookingCreate',
        component: () => import('../pages/booking/BookingCreatePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/achievements',
        name: 'Achievements',
        component: () => import('../pages/mine/AchievementPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/points/records',
        name: 'PointRecords',
        component: () => import('../pages/point/PointRecordPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/gifts',
        name: 'GiftShop',
        component: () => import('../pages/gift/GiftShopPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/gifts/:giftId',
        name: 'GiftDetail',
        component: () => import('../pages/gift/GiftDetailPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/gifts/exchanges',
        name: 'MyExchanges',
        component: () => import('../pages/gift/MyExchangesPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/activities',
        name: 'ActivityList',
        component: () => import('../pages/activity/ActivityListPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/activities/:activityId',
        name: 'ActivityDetail',
        component: () => import('../pages/activity/ActivityDetailPage.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    // 确保从 localStorage 同步 token
    const token = localStorage.getItem('token')
    if (token && !userStore.token) {
        userStore.token = token
    }
    const isAuthenticated = !!userStore.token

    // 如果访问根路径且未登录，跳转到登录页
    if (to.path === '/' && !isAuthenticated) {
        next('/login')
        return
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
        // 已登录用户访问登录页，重定向到首页
        next('/')
    } else {
        next()
    }
})

export default router