<template>
  <div class="sport-record-container">
    <NavBar title="记录运动" :show-back="true" />

    <div class="record-content">
      <!-- 运动类型选择 -->
      <div class="sport-type-section">
        <h3 class="section-title">选择运动类型</h3>
        <div class="sport-type-grid">
          <div
              v-for="sport in sportTypes"
              :key="sport.id"
              :class="['sport-type-card', { active: selectedSportType === sport.id }]"
              @click="selectSportType(sport.id)"
          >
            <div class="sport-icon" :style="{ backgroundColor: sport.color }">
              <el-icon :size="24"><component :is="sport.icon" /></el-icon>
            </div>
            <span class="sport-name">{{ sport.name }}</span>
          </div>
        </div>
      </div>

      <!-- 运动数据记录 -->
      <div class="record-data-section" v-if="selectedSportType">
        <h3 class="section-title">记录运动数据</h3>

        <el-form
            :model="recordForm"
            :rules="recordRules"
            ref="recordFormRef"
            label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                    v-model="recordForm.startTime"
                    type="datetime"
                    placeholder="选择开始时间"
                    style="width: 100%"
                    :disabled-date="disabledDate"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                    v-model="recordForm.endTime"
                    type="datetime"
                    placeholder="选择结束时间"
                    style="width: 100%"
                    :disabled-date="disabledDate"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12" v-if="showDistance">
              <el-form-item label="距离（公里）" prop="distance">
                <el-input-number
                    v-model="recordForm.distance"
                    :min="0"
                    :step="0.1"
                    :precision="2"
                    controls-position="right"
                    style="width: 100%"
                    placeholder="请输入距离"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="消耗卡路里" prop="calories">
                <el-input-number
                    v-model="recordForm.calories"
                    :min="0"
                    :step="10"
                    controls-position="right"
                    style="width: 100%"
                    placeholder="估算卡路里"
                >
                  <template #append>大卡</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="运动备注" prop="notes">
            <el-input
                v-model="recordForm.notes"
                type="textarea"
                :rows="3"
                placeholder="记录本次运动的感受、天气情况等（可选）"
                maxlength="200"
                show-word-limit
            />
          </el-form-item>

          <!-- 自动计算的数据展示 -->
          <div class="calculated-data" v-if="showCalculatedData">
            <h4>运动统计</h4>
            <el-row :gutter="20" class="stats-grid">
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ calculatedData.duration }}分钟</div>
                  <div class="stat-label">运动时长</div>
                </div>
              </el-col>
              <el-col :span="8" v-if="showDistance && recordForm.distance > 0">
                <div class="stat-item">
                  <div class="stat-value">{{ calculatedData.pace }}分钟/公里</div>
                  <div class="stat-label">平均配速</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ recordForm.calories || 0 }}大卡</div>
                  <div class="stat-label">消耗热量</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

      <!-- 提交按钮 -->
      <div class="action-section" v-if="selectedSportType">
        <el-button
            type="primary"
            size="large"
            :loading="submitting"
            @click="submitRecord"
            class="submit-btn"
        >
          {{ submitting ? '提交中...' : '保存运动记录' }}
        </el-button>
      </div>

      <!-- 未选择类型的提示 -->
      <div class="empty-state" v-else>
        <el-empty description="请先选择运动类型">
          <el-icon :size="48" style="color: #409eff;"><VideoCamera /></el-icon>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  VideoCamera, // 跑步
  User, // 健走
  Promotion, // 骑行
  Star, // 瑜伽
  Medal, // HIIT
  Lightning, // 力量训练
  Trophy, // 游泳
  Location, // 篮球、足球
  Clock // 其他
} from '@element-plus/icons-vue'
import NavBar from '@/components/common/NavBar.vue'
import { uploadSportRecordApi } from '@/api/sport'
import type { SportRecordParams } from '@/api/model/sportModel'

const router = useRouter()
const recordFormRef = ref<FormInstance>()
const submitting = ref(false)

// 运动类型配置（使用 markRaw 防止图标组件被响应式化）
const sportTypes = ref([
  { id: 1, name: '跑步', icon: markRaw(VideoCamera), color: '#ff6b6b' }, // 跑步 - VideoCamera（录制运动）
  { id: 2, name: '健走', icon: markRaw(User), color: '#4ecdc4' }, // 健走 - User（人/步行）
  { id: 3, name: '骑行', icon: markRaw(Promotion), color: '#45b7d1' }, // 骑行 - Promotion（移动/前进）
  { id: 4, name: '瑜伽', icon: markRaw(Star), color: '#96ceb4' }, // 瑜伽 - Star（平衡/柔和）
  { id: 5, name: 'HIIT', icon: markRaw(Medal), color: '#feca57' }, // HIIT - Medal（高强度/奖牌）
  { id: 6, name: '力量训练', icon: markRaw(Lightning), color: '#ff9ff3' }, // 力量训练 - Lightning（力量/能量）
  { id: 7, name: '游泳', icon: markRaw(Trophy), color: '#54a0ff' }, // 游泳 - Trophy（水上运动/成就）
  { id: 8, name: '篮球', icon: markRaw(Location), color: '#ee5a24' }, // 篮球 - Location（场地/位置）
  { id: 9, name: '足球', icon: markRaw(Location), color: '#00d2d3' }, // 足球 - Location（场地/位置）
  { id: 10, name: '其他', icon: markRaw(Clock), color: '#8395a7' } // 其他 - Clock（时间/通用）
])

const selectedSportType = ref<number | null>(null)

// 表单数据
const recordForm = reactive({
  startTime: '',
  endTime: '',
  distance: 0,
  calories: 0,
  notes: ''
})

// 验证函数（需要在 recordRules 之前定义）
// 注意：这些函数会在表单验证时被调用，此时所有响应式数据都已初始化
const validateEndTime = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback()
    return
  }
  if (!recordForm.startTime) {
    callback(new Error('请先选择开始时间'))
    return
  }
  const start = new Date(recordForm.startTime)
  const end = new Date(value)
  if (end <= start) {
    callback(new Error('结束时间必须晚于开始时间'))
    return
  }
  callback()
}

const validateDistance = (rule: any, value: number, callback: any) => {
  // 如果不需要显示距离字段，则不验证
  const distanceSports = [1, 2, 3, 7] // 跑步、健走、骑行、游泳
  const needsDistance = selectedSportType.value ? distanceSports.includes(selectedSportType.value) : false
  
  if (!needsDistance) {
    callback()
    return
  }
  
  if (value === undefined || value === null) {
    callback()
    return
  }
  if (value <= 0) {
    callback(new Error('距离必须大于0'))
    return
  }
  if (value > 1000) {
    callback(new Error('距离不能超过1000公里'))
    return
  }
  callback()
}

// 验证规则
const recordRules = reactive<FormRules>({
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    { validator: validateEndTime, trigger: 'change' }
  ],
  distance: [
    { validator: validateDistance, trigger: 'blur' }
  ],
  calories: [
    { required: true, message: '请输入消耗卡路里', trigger: 'blur' },
    { type: 'number', min: 1, message: '卡路里必须大于0', trigger: 'blur' }
  ]
})

// 计算属性
const showDistance = computed(() => {
  // 需要记录距离的运动类型
  const distanceSports = [1, 2, 3, 7] // 跑步、健走、骑行、游泳
  return selectedSportType.value ? distanceSports.includes(selectedSportType.value) : false
})

const showCalculatedData = computed(() => {
  return recordForm.startTime && recordForm.endTime
})

const calculatedData = computed(() => {
  const duration = calculateDuration()
  const pace = calculatePace()

  return {
    duration,
    pace: pace > 0 ? pace.toFixed(1) : 0
  }
})

// 方法
const selectSportType = (typeId: number) => {
  selectedSportType.value = typeId
  // 为不同运动类型设置默认卡路里
  setDefaultCalories(typeId)
}

const setDefaultCalories = (typeId: number) => {
  const calorieMap: { [key: number]: number } = {
    1: 300, // 跑步
    2: 200, // 健走
    3: 250, // 骑行
    4: 150, // 瑜伽
    5: 400, // HIIT
    6: 280, // 力量训练
    7: 350, // 游泳
    8: 320, // 篮球
    9: 380, // 足球
    10: 200  // 其他
  }
  recordForm.calories = calorieMap[typeId] || 200
}

const calculateDuration = (): number => {
  if (!recordForm.startTime || !recordForm.endTime) return 0

  const start = new Date(recordForm.startTime).getTime()
  const end = new Date(recordForm.endTime).getTime()
  const durationMs = end - start

  if (durationMs <= 0) return 0
  return Math.round(durationMs / (1000 * 60)) // 转换为分钟
}

const calculatePace = (): number => {
  if (!recordForm.distance || recordForm.distance <= 0) return 0
  const duration = calculateDuration()
  if (duration <= 0) return 0
  return duration / recordForm.distance
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const submitRecord = async () => {
  if (!recordFormRef.value) return

  try {
    const valid = await recordFormRef.value.validate()
    if (!valid) return

    submitting.value = true

    const duration = calculateDuration()
    if (duration <= 0) {
      ElMessage.error('运动时长必须大于0')
      return
    }

    // 格式化日期为后端期望的格式：yyyy-MM-dd HH:mm:ss
    const formatDateTime = (date: Date | string): string => {
      const d = typeof date === 'string' ? new Date(date) : date
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    const recordData: SportRecordParams = {
      sportType: selectedSportType.value!,
      startTime: formatDateTime(recordForm.startTime),
      endTime: formatDateTime(recordForm.endTime),
      duration: duration * 60, // 转换为秒
      distance: recordForm.distance || 0,
      calories: recordForm.calories,
      notes: recordForm.notes
    }

    const res = await uploadSportRecordApi(recordData)

    if (res.code === 200) {
      ElMessage.success('运动记录保存成功！')

      await ElMessageBox.confirm('是否继续记录下一项运动？', '记录成功', {
        confirmButtonText: '继续记录',
        cancelButtonText: '返回首页',
        type: 'success'
      })

      // 重置表单继续记录
      resetForm()
    } else {
      ElMessage.error('保存失败：' + res.message)
    }
  } catch (error: any) {
    if (error === 'cancel') {
      // 用户选择返回首页
      router.push('/')
    } else {
      console.error('Submit record error:', error)
      ElMessage.error(error.message || '保存失败')
    }
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  recordFormRef.value?.resetFields()
  recordForm.distance = 0
  recordForm.calories = 0
  recordForm.notes = ''
}

// 监听开始和结束时间变化，自动计算时长
watch([() => recordForm.startTime, () => recordForm.endTime], () => {
  if (recordForm.startTime && recordForm.endTime) {
    const duration = calculateDuration()
    if (duration > 0 && recordForm.calories === 0) {
      // 根据时长估算卡路里（简单估算：每分钟消耗5-10大卡）
      const baseCalories = duration * 7
      recordForm.calories = Math.round(baseCalories)
    }
  }
})
</script>

<style scoped lang="scss">
.sport-record-container {
  min-height: 100vh;
  background-color: #f5f7fa;

  .record-content {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .section-title {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .sport-type-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .sport-type-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 12px;

      .sport-type-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 8px;
        border: 2px solid #f0f0f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: white;

        &:hover {
          border-color: #409eff;
          transform: translateY(-2px);
        }

        &.active {
          border-color: #409eff;
          background: #f0f9ff;

          .sport-name {
            color: #409eff;
            font-weight: 600;
          }
        }

        .sport-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          color: white;
        }

        .sport-name {
          font-size: 12px;
          text-align: center;
          color: #666;
        }
      }
    }
  }

  .record-data-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .calculated-data {
      margin-top: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      h4 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 14px;
      }

      .stats-grid {
        .stat-item {
          text-align: center;
          padding: 8px;

          .stat-value {
            font-size: 16px;
            font-weight: 600;
            color: #409eff;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }

  .action-section {
    text-align: center;
    margin-top: 30px;

    .submit-btn {
      width: 100%;
      max-width: 300px;
      height: 48px;
      font-size: 16px;
      border-radius: 24px;
    }
  }

  .empty-state {
    background: white;
    padding: 60px 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sport-record-container {
    .record-content {
      padding: 15px;
    }

    .sport-type-section {
      padding: 16px;

      .sport-type-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;

        .sport-type-card {
          padding: 12px 4px;

          .sport-icon {
            width: 40px;
            height: 40px;
          }
        }
      }
    }

    .record-data-section {
      padding: 16px;
    }
  }
}

@media (max-width: 480px) {
  .sport-record-container {
    .sport-type-section {
      .sport-type-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>