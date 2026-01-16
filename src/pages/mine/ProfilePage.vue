<template>
  <div class="profile-page">
    <h2>个人中心</h2>
    <div class="profile-content" v-if="userStore.userInfo">
      <el-card class="user-card">
        <div class="user-header">
          <el-avatar :size="80" :src="userStore.userInfo.avatarUrl" />
          <div class="user-info">
            <h3>{{ userStore.userInfo.nickname }}</h3>
            <p class="mobile">{{ userStore.userInfo.mobile }}</p>
            <p class="points">当前可用积分：{{ currentPoints }}</p>
          </div>
          <el-button type="primary" @click="goToEdit">修改个人信息</el-button>
        </div>
      </el-card>

      <el-card class="info-card">
        <h3 class="card-title">个人信息</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="label">性别：</span>
            <span class="value">{{ getGenderText(userStore.userInfo.gender) }}</span>
          </div>
          <div class="info-item" v-if="userStore.userInfo.birthday">
            <span class="label">生日：</span>
            <span class="value">{{ userStore.userInfo.birthday }}</span>
          </div>
          <div class="info-item" v-if="userStore.userInfo.height">
            <span class="label">身高：</span>
            <span class="value">{{ userStore.userInfo.height }} cm</span>
          </div>
          <div class="info-item" v-if="userStore.userInfo.weight">
            <span class="label">体重：</span>
            <span class="value">{{ userStore.userInfo.weight }} kg</span>
          </div>
          <div class="info-item" v-if="userStore.userInfo.goalType">
            <span class="label">运动目标：</span>
            <span class="value">{{ getGoalTypeText(userStore.userInfo.goalType) }}</span>
          </div>
          <div class="info-item" v-if="userStore.userInfo.activityLevel">
            <span class="label">活动强度：</span>
            <span class="value">{{ getActivityLevelText(userStore.userInfo.activityLevel) }}</span>
          </div>
        </div>
      </el-card>

      <el-card class="menu-card">
        <el-menu>
          <el-menu-item @click="goToBookings">
            <el-icon><Calendar /></el-icon>
            <span>我的预约</span>
          </el-menu-item>
          <el-menu-item @click="goToHistory">
            <el-icon><Clock /></el-icon>
            <span>运动历史</span>
          </el-menu-item>
          <el-menu-item @click="goToRank">
            <el-icon><Trophy /></el-icon>
            <span>排行榜</span>
          </el-menu-item>
          <el-menu-item @click="goToAchievements">
            <el-icon><Star /></el-icon>
            <span>运动成就</span>
          </el-menu-item>
          <el-menu-item @click="goToPointRecords">
            <el-icon><Wallet /></el-icon>
            <span>积分记录</span>
          </el-menu-item>
          <el-menu-item @click="goToGiftShop">
            <el-icon><Present /></el-icon>
            <span>礼品商城</span>
          </el-menu-item>
          <el-menu-item @click="goToActivities">
            <el-icon><Promotion /></el-icon>
            <span>活动中心</span>
          </el-menu-item>
        </el-menu>
      </el-card>

      <div class="logout-section">
        <el-button type="danger" @click="handleLogout" style="width: 100%">
          退出登录
        </el-button>
      </div>
    </div>
    <div v-else class="loading">
      <el-loading />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Trophy, Clock, Calendar, Star, Wallet, Present, Promotion } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getMyAchievementsApi } from '@/api/achievement'

const router = useRouter()
const userStore = useUserStore()
const currentPoints = ref(0)

const goToHistory = () => {
  router.push('/sport/history')
}

const goToRank = () => {
  router.push('/sport/rank')
}

const goToEdit = () => {
  router.push('/profile/edit')
}

const goToBookings = () => {
  router.push('/bookings')
}

const goToAchievements = () => {
  router.push('/achievements')
}

const goToPointRecords = () => {
  router.push('/points/records')
}

const goToGiftShop = () => {
  router.push('/gifts')
}

const goToActivities = () => {
  router.push('/activities')
}

const loadCurrentPoints = async () => {
  try {
    const res = await getMyAchievementsApi()
    if (res.code === 200 && res.data) {
      currentPoints.value = res.data.currentPoints
    }
  } catch (error) {
    // 忽略错误
  }
}

const getGenderText = (gender: number | undefined | null): string => {
  if (gender === undefined || gender === null) return '未设置'
  const genderMap: Record<number, string> = {
    1: '男',
    2: '女'
  }
  return genderMap[gender] || '未设置'
}

const getGoalTypeText = (goalType: number | undefined | null): string => {
  if (goalType === undefined || goalType === null) return '未设置'
  const goalMap: Record<number, string> = {
    1: '减脂',
    2: '增肌',
    3: '塑形'
  }
  return goalMap[goalType] || '未设置'
}

const getActivityLevelText = (activityLevel: number | undefined | null): string => {
  if (activityLevel === undefined || activityLevel === null) return '未设置'
  const levelMap: Record<number, string> = {
    1: '低',
    2: '中',
    3: '高'
  }
  return levelMap[activityLevel] || '未设置'
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 用户取消
  }
}

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.getProfile()
  }
  await loadCurrentPoints()
})
</script>

<style scoped lang="scss">
.profile-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .profile-content {
    .user-card {
      margin-bottom: 20px;

      .user-header {
        display: flex;
        align-items: center;
        gap: 15px;

        .user-info {
          flex: 1;

          h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
          }

          .mobile {
            margin: 0;
            font-size: 14px;
            color: #999;
          }

          .points {
            margin: 4px 0 0 0;
            font-size: 14px;
            color: #F56C6C;
            font-weight: 600;
          }
        }
      }
    }

    .info-card {
      margin-bottom: 20px;

      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px 0;
      }

      .info-list {
        .info-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .label {
            width: 100px;
            color: #666;
            font-size: 14px;
          }

          .value {
            flex: 1;
            color: #333;
            font-size: 14px;
          }
        }
      }
    }

    .menu-card {
      margin-bottom: 20px;
    }

    .logout-section {
      margin-top: 20px;
    }
  }
}
</style>
