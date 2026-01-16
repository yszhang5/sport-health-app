<template>
  <div class="point-record-page">
    <h2>积分记录</h2>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="获得记录" name="earned">
        <div class="point-record-list">
          <div v-if="earnedRecords.length === 0" class="empty">
            <el-empty description="暂无记录" />
          </div>
          <div v-else>
            <PointRecordItem
              v-for="record in earnedRecords"
              :key="record.recordId"
              :record="record"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消耗记录" name="spent">
        <div class="point-record-list">
          <div v-if="spentRecords.length === 0" class="empty">
            <el-empty description="暂无记录" />
          </div>
          <div v-else>
            <PointRecordItem
              v-for="record in spentRecords"
              :key="record.recordId"
              :record="record"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-card class="rules-card" style="margin-top: 20px;">
      <h3>积分规则</h3>
      <div v-loading="rulesLoading" class="rules-content">
        <div v-if="rules" class="rules-list">
          <div v-for="rule in rules.rules" :key="rule.type" class="rule-item">
            <span class="rule-type">{{ rule.typeName }}</span>
            <span class="rule-desc">{{ rule.description }}</span>
            <span class="rule-points">+{{ rule.points }}积分</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPointRecordsApi, getPointRulesApi, type PointRecordVO, type PointRuleVO } from '@/api/point'
import PointRecordItem from '@/components/point/PointRecordItem.vue'

const activeTab = ref('earned')
const loading = ref(false)
const rulesLoading = ref(false)
const records = ref<PointRecordVO[]>([])
const rules = ref<PointRuleVO | null>(null)

const earnedRecords = computed(() => 
  records.value.filter(r => r.points > 0)
)

const spentRecords = computed(() => 
  records.value.filter(r => r.points < 0)
)

const loadRecords = async () => {
  loading.value = true
  try {
    const res = await getPointRecordsApi()
    if (res.code === 200) {
      records.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载积分记录失败')
  } finally {
    loading.value = false
  }
}

const loadRules = async () => {
  rulesLoading.value = true
  try {
    const res = await getPointRulesApi()
    if (res.code === 200) {
      rules.value = res.data
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载积分规则失败')
  } finally {
    rulesLoading.value = false
  }
}

const handleTabChange = () => {
  // Tab 切换时不需要重新加载
}

onMounted(() => {
  loadRecords()
  loadRules()
})
</script>


<style scoped lang="scss">
.point-record-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  .rules-card {
    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .rules-list {
      .rule-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .rule-type {
          width: 100px;
          font-weight: 600;
          color: #333;
        }

        .rule-desc {
          flex: 1;
          color: #666;
        }

        .rule-points {
          color: #67C23A;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
