<template>
  <div class="my-bookings-page">
    <h2>我的预约</h2>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="待确认" name="pending">
        <BookingList :bookings="pendingBookings" @cancel="handleCancel" />
      </el-tab-pane>
      <el-tab-pane label="已确认" name="confirmed">
        <BookingList :bookings="confirmedBookings" @cancel="handleCancel" />
      </el-tab-pane>
      <el-tab-pane label="已完成" name="completed">
        <BookingList :bookings="completedBookings" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyBookingsApi, cancelBookingApi, type BookingVO } from '@/api/booking'
import BookingList from '@/components/booking/BookingList.vue'

const activeTab = ref('pending')
const bookings = ref<BookingVO[]>([])
const loading = ref(false)

const pendingBookings = computed(() => 
  bookings.value.filter(b => b.status === 0)
)

const confirmedBookings = computed(() => 
  bookings.value.filter(b => b.status === 1)
)

const completedBookings = computed(() => 
  bookings.value.filter(b => b.status === 2)
)

const loadBookings = async () => {
  loading.value = true
  try {
    const res = await getMyBookingsApi()
    if (res.code === 200) {
      bookings.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载预约列表失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  // Tab 切换时不需要重新加载，因为数据已经全部加载了
}

const handleCancel = async (bookingId: number) => {
  try {
    await ElMessageBox.confirm('确定要取消这个预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cancelBookingApi(bookingId)
    ElMessage.success('取消预约成功')
    loadBookings()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消预约失败')
    }
  }
}

onMounted(() => {
  loadBookings()
})
</script>

<style scoped lang="scss">
.my-bookings-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>
