<template>
  <div class="gift-shop-page">
    <h2>礼品商城</h2>
    <div class="filters">
      <el-select v-model="filters.type" placeholder="选择类型" clearable style="width: 150px; margin-right: 12px;">
        <el-option label="实物" value="physical" />
        <el-option label="虚拟服务" value="virtual" />
        <el-option label="APP权益" value="app_benefit" />
      </el-select>
      <el-select v-model="filters.sortBy" placeholder="排序方式" style="width: 150px;">
        <el-option label="积分升序" value="points_asc" />
        <el-option label="积分降序" value="points_desc" />
      </el-select>
    </div>
    <div v-loading="loading" class="gifts-grid">
      <GiftCard
        v-for="gift in gifts"
        :key="gift.giftId"
        :gift="gift"
        @click="handleGiftClick(gift.giftId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getGiftListApi, type GiftVO } from '@/api/gift'
import GiftCard from '@/components/gift/GiftCard.vue'

const router = useRouter()
const loading = ref(false)
const gifts = ref<GiftVO[]>([])
const filters = ref({
  type: '',
  sortBy: 'points_asc'
})

const loadGifts = async () => {
  loading.value = true
  try {
    const res = await getGiftListApi({
      type: filters.value.type || undefined,
      sortBy: filters.value.sortBy as 'points_asc' | 'points_desc' | undefined
    })
    if (res.code === 200) {
      gifts.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载礼品列表失败')
  } finally {
    loading.value = false
  }
}

const handleGiftClick = (giftId: number) => {
  router.push(`/gifts/${giftId}`)
}

watch(filters, () => {
  loadGifts()
}, { deep: true })

onMounted(() => {
  loadGifts()
})
</script>

<style scoped lang="scss">
.gift-shop-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  .filters {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .gifts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}
</style>
