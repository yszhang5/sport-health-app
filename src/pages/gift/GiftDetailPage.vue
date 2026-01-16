<template>
  <div class="gift-detail-page">
    <h2>礼品详情</h2>
    <div v-loading="loading" v-if="gift">
      <el-card class="gift-card">
        <div class="gift-header">
          <img :src="gift.image" :alt="gift.name" class="gift-image" />
          <div class="gift-info">
            <h1 class="gift-name">{{ gift.name }}</h1>
            <div class="gift-meta">
              <el-tag>{{ gift.typeName }}</el-tag>
              <span class="points">所需积分：{{ gift.points }}</span>
            </div>
            <div class="gift-description">{{ gift.description }}</div>
            <div class="gift-stock">库存：{{ gift.stock }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="exchange-card" style="margin-top: 20px;">
        <h3>兑换信息</h3>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" v-if="gift.type === 'physical'">
          <el-form-item label="收货地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入收货地址" />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-form>
        <div class="exchange-info">
          <div class="current-points">当前可用积分：{{ currentPoints }}</div>
          <el-button 
            type="primary" 
            size="large" 
            @click="handleExchange"
            :loading="exchanging"
            :disabled="currentPoints < gift.points || gift.stock === 0"
            style="width: 100%; margin-top: 16px;"
          >
            {{ gift.stock === 0 ? '库存不足' : currentPoints < gift.points ? '积分不足' : '立即兑换' }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getGiftDetailApi, exchangeGiftApi, type GiftVO, type GiftExchangeParams } from '@/api/gift'
import { getMyAchievementsApi } from '@/api/achievement'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const exchanging = ref(false)
const gift = ref<GiftVO | null>(null)
const currentPoints = ref(0)

const form = ref<GiftExchangeParams>({
  giftId: 0,
  address: '',
  contactPhone: ''
})

const rules: FormRules = {
  address: [
    { required: true, message: '请输入收货地址', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const loadGift = async () => {
  const giftId = Number(route.params.giftId)
  if (!giftId) {
    ElMessage.error('礼品ID无效')
    router.back()
    return
  }

  loading.value = true
  try {
    const res = await getGiftDetailApi(giftId)
    if (res.code === 200) {
      gift.value = res.data
      form.value.giftId = giftId
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载礼品详情失败')
  } finally {
    loading.value = false
  }
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

const handleExchange = async () => {
  if (!gift.value) return

  if (gift.value.type === 'physical') {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
      if (!valid) return
      doExchange()
    })
  } else {
    doExchange()
  }
}

const doExchange = async () => {
  if (!gift.value) return

  exchanging.value = true
  try {
    const res = await exchangeGiftApi(form.value)
    if (res.code === 200) {
      ElMessage.success('兑换成功')
      router.push('/gifts/exchanges')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '兑换失败')
  } finally {
    exchanging.value = false
  }
}

onMounted(() => {
  loadGift()
  loadCurrentPoints()
})
</script>

<style scoped lang="scss">
.gift-detail-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  .gift-card {
    .gift-header {
      display: flex;
      gap: 24px;

      .gift-image {
        width: 300px;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
      }

      .gift-info {
        flex: 1;

        .gift-name {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .gift-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;

          .points {
            font-size: 18px;
            color: #F56C6C;
            font-weight: 600;
          }
        }

        .gift-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .gift-stock {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }

  .exchange-card {
    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .exchange-info {
      .current-points {
        font-size: 16px;
        color: #666;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
