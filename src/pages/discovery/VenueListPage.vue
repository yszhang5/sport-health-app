<template>
  <div class="venue-list-page">
    <h2>附近场馆</h2>
    
    <div class="filter-bar">
      <el-select v-model="filterType" placeholder="全部类型" style="width: 120px; margin-right: 10px;" @change="handleFilterChange">
        <el-option label="全部类型" :value="null" />
        <el-option label="健身房" :value="0" />
        <el-option label="瑜伽馆" :value="1" />
        <el-option label="游泳馆" :value="2" />
      </el-select>
    </div>

    <div v-loading="loading" class="venue-list">
      <el-card
        v-for="venue in venueList"
        :key="venue.venueId"
        class="venue-card"
        @click="toVenueDetail(venue.venueId)"
      >
        <img 
          v-if="venue.images && venue.images.length > 0" 
          :src="venue.images[0]" 
          :alt="venue.name" 
          class="cover" 
        />
        <div v-else class="cover-placeholder">暂无图片</div>
        <div class="info">
          <h4 class="name">{{ venue.name }}</h4>
          <div class="tags">
            <el-tag
              type="primary"
              plain
              size="small"
              style="margin-right: 6px;"
            >
              {{ venue.typeName }}
            </el-tag>
          </div>
          <div class="address">
            <el-icon><Location /></el-icon>
            {{ venue.address }}<span v-if="venue.distance"> · {{ formatDistance(venue.distance * 1000) }}</span>
          </div>
          <div class="footer">
            <div class="rating">
              <el-icon><Star /></el-icon>
              {{ venue.rating || 0 }}
            </div>
            <div class="reviews">
              {{ formatNumber(venue.reviewCount) }}条评价
            </div>
          </div>
        </div>
      </el-card>
      
      <el-empty v-if="!loading && venueList.length === 0" description="暂无场馆数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Location, Star } from '@element-plus/icons-vue'
import { getVenueListApi } from '@/api/venue'
import type { VenueVO } from '@/api/model/venueModel'

const router = useRouter()

const venueList = ref<VenueVO[]>([])
const loading = ref(false)
const filterType = ref<number | null>(null) // null 表示全部类型

const formatDistance = (distance: number | undefined | null) => {
  if (distance === undefined || distance === null || isNaN(distance)) {
    return ''
  }
  if (distance < 1000) {
    return `${distance}m`
  }
  return `${(distance / 1000).toFixed(1)}km`
}

const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const loadVenues = async () => {
  loading.value = true
  try {
    // 根据筛选类型构建查询参数
    const params: { typeId?: number } = {}
    if (filterType.value !== null) {
      params.typeId = filterType.value
    }
    
    const res = await getVenueListApi(params)
    if (res.code === 200) {
      venueList.value = res.data
    }
  } catch (error) {
    console.error('Load venues failed:', error)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  // 筛选类型改变时重新加载场馆列表
  loadVenues()
}

const toVenueDetail = (venueId: number) => {
  router.push(`/venues/${venueId}`)
}

onMounted(() => {
  loadVenues()
})
</script>

<style scoped lang="scss">
.venue-list-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .filter-bar {
    margin-bottom: 20px;
  }

  .venue-list {
    .venue-card {
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      .cover {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: 4px 4px 0 0;
      }

      .cover-placeholder {
        width: 100%;
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #999;
        border-radius: 4px 4px 0 0;
      }

      .info {
        padding: 16px;

        .name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
        }

        .tags {
          margin-bottom: 8px;
        }

        .address {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #999;
          margin-bottom: 12px;
        }

        .footer {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          color: #666;

          .rating {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }
}
</style>
