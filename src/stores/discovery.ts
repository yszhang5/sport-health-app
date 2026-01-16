import { request } from '../utils/request'
import type {
    Banner,
    SportProject,
    HealthArticle,
    Course,
    Venue,
    Activity,
    UserGoal,
    PageParams,
    PageResponse,
} from './model'

// Mock 数据开关 - 开发时使用 mock，后端就绪后改为 false
const USE_MOCK = true

// Mock 数据
const mockBanners: Banner[] = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        title: '夏日燃脂计划',
        type: 'activity',
        targetId: 'activity_1',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
        title: '瑜伽大师课',
        type: 'course',
        targetId: 'course_1',
    },
]

const mockSportProjects: SportProject[] = [
    {
        id: '1',
        name: '跑步',
        cover: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
        description: '最简单有效的有氧运动',
        category: 'aerobic',
        difficulty: 'beginner',
        duration: 30,
        calories: 300,
        equipment: ['跑鞋'],
        benefits: ['燃脂', '提升心肺', '增强耐力'],
        tags: ['有氧', '减脂', '户外'],
    },
    {
        id: '2',
        name: 'HIIT',
        cover: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400',
        description: '高强度间歇训练',
        category: 'aerobic',
        difficulty: 'advanced',
        duration: 20,
        calories: 400,
        equipment: ['瑜伽垫'],
        benefits: ['极速燃脂', '提升代谢', '增强爆发力'],
        tags: ['燃脂', '高效', '室内'],
    },
    {
        id: '3',
        name: '瑜伽',
        cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        description: '身心平衡的艺术',
        category: 'flexibility',
        difficulty: 'beginner',
        duration: 60,
        calories: 150,
        equipment: ['瑜伽垫', '瑜伽砖'],
        benefits: ['柔韧性', '减压', '塑形'],
        tags: ['柔韧', '减压', '塑形'],
    },
    {
        id: '4',
        name: '力量训练',
        cover: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
        description: '打造完美肌肉线条',
        category: 'strength',
        difficulty: 'intermediate',
        duration: 45,
        calories: 350,
        equipment: ['哑铃', '杠铃'],
        benefits: ['增肌', '塑形', '提升力量'],
        tags: ['增肌', '力量', '塑形'],
    },
]

const mockArticles: HealthArticle[] = [
    {
        id: '1',
        title: '跑步新手必看：如何避免运动损伤',
        cover: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
        summary: '跑步是最简单的运动，但也最容易受伤。掌握这些要点...',
        content: '',
        author: '健身教练小王',
        publishTime: '2024-01-15 10:30',
        views: 2580,
        likes: 156,
        category: '运动知识',
        tags: ['跑步', '新手', '损伤预防'],
    },
    {
        id: '2',
        title: 'HIIT训练：20分钟燃脂相当于1小时慢跑',
        cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        summary: 'HIIT高强度间歇训练，让你在短时间内达到最佳燃脂效果...',
        content: '',
        author: '营养师李医生',
        publishTime: '2024-01-14 15:20',
        views: 3420,
        likes: 289,
        category: '健身指南',
        tags: ['HIIT', '燃脂', '高效'],
    },
]

const mockCourses: Course[] = [
    {
        id: '1',
        title: '零基础瑜伽入门课',
        cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
        instructor: '张老师',
        instructorAvatar: 'https://i.pravatar.cc/150?img=1',
        description: '专为零基础学员设计的瑜伽入门课程',
        type: 'online',
        category: '瑜伽',
        difficulty: 'beginner',
        duration: 45,
        price: 0,
        students: 1580,
        rating: 4.8,
        lessons: 12,
        isFeatured: true,
        tags: ['零基础', '柔韧', '减压'],
    },
    {
        id: '2',
        title: '21天燃脂塑形挑战',
        cover: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        instructor: '李教练',
        instructorAvatar: 'https://i.pravatar.cc/150?img=2',
        description: '科学训练计划，21天见证身材蜕变',
        type: 'online',
        category: 'HIIT',
        difficulty: 'intermediate',
        duration: 30,
        price: 99,
        originalPrice: 199,
        students: 3256,
        rating: 4.9,
        lessons: 21,
        isFeatured: true,
        tags: ['燃脂', '塑形', '系统课'],
    },
]

const mockActivities: Activity[] = [
    {
        id: '1',
        title: '7天跑步挑战赛',
        cover: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400',
        type: 'challenge',
        startTime: '2024-01-20',
        endTime: '2024-01-27',
        description: '连续7天完成3公里跑步，赢取专属徽章',
        rule: '每天完成至少3公里跑步，连续打卡7天',
        reward: {
            type: 'badge',
            value: 'runner_7days',
            name: '7日跑者徽章',
        },
        participants: 2580,
        status: 'ongoing',
        tags: ['跑步', '挑战', '徽章'],
    },
    {
        id: '2',
        title: '新春健身嘉年华',
        cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        type: 'event',
        startTime: '2024-02-01',
        endTime: '2024-02-15',
        description: '新春期间，完成指定运动任务赢取积分大礼包',
        rule: '完成任意3种运动类型，每种累计时长达到2小时',
        reward: {
            type: 'points',
            value: 500,
            name: '500积分',
        },
        participants: 1256,
        maxParticipants: 5000,
        status: 'upcoming',
        tags: ['活动', '积分', '多样运动'],
    },
]

const mockUserGoals: UserGoal[] = [
    { type: 'weight_loss', name: '减脂', icon: '' },
    { type: 'muscle_gain', name: '增肌', icon: '' },
    { type: 'body_shape', name: '塑形', icon: '' },
    { type: 'health', name: '健康', icon: '' },
    { type: 'competition', name: '竞技', icon: '' },
]

// API 方法
export const discoveryApi = {
    // 获取轮播图
    async getBanners(): Promise<Banner[]> {
        if (USE_MOCK) {
            return Promise.resolve(mockBanners)
        }
        return request.get('/discovery/banners')
    },

    // 获取运动项目
    async getSportProjects(): Promise<SportProject[]> {
        if (USE_MOCK) {
            return Promise.resolve(mockSportProjects)
        }
        return request.get('/discovery/sport-projects')
    },

    // 获取健康资讯
    async getArticles(params?: PageParams): Promise<PageResponse<HealthArticle>> {
        if (USE_MOCK) {
            return Promise.resolve({
                list: mockArticles,
                total: mockArticles.length,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                hasMore: false,
            })
        }
        return request.get('/discovery/articles', { params })
    },

    // 获取精选课程
    async getFeaturedCourses(): Promise<Course[]> {
        if (USE_MOCK) {
            return Promise.resolve(mockCourses.filter((c) => c.isFeatured))
        }
        return request.get('/discovery/courses/featured')
    },

    // 获取活动列表
    async getActivities(params?: PageParams): Promise<PageResponse<Activity>> {
        if (USE_MOCK) {
            return Promise.resolve({
                list: mockActivities,
                total: mockActivities.length,
                page: params?.page || 1,
                pageSize: params?.pageSize || 10,
                hasMore: false,
            })
        }
        return request.get('/discovery/activities', { params })
    },

    // 获取用户目标选项
    async getUserGoals(): Promise<UserGoal[]> {
        if (USE_MOCK) {
            return Promise.resolve(mockUserGoals)
        }
        return request.get('/discovery/user-goals')
    },

    // 根据目标推荐内容
    async getRecommendations(goalType: string): Promise<{
        courses: Course[]
        articles: HealthArticle[]
        sportProjects: SportProject[]
    }> {
        if (USE_MOCK) {
            return Promise.resolve({
                courses: mockCourses.slice(0, 2),
                articles: mockArticles.slice(0, 2),
                sportProjects: mockSportProjects.slice(0, 2),
            })
        }
        return request.get(`/discovery/recommendations/${goalType}`)
    },
}