<template>
  <div class="profile-edit-page">
    <h2>修改个人信息</h2>
    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 600px;"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="身高 (cm)" prop="height">
          <el-input-number
            v-model="form.height"
            :min="50"
            :max="250"
            :precision="1"
            placeholder="请输入身高"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="体重 (kg)" prop="weight">
          <el-input-number
            v-model="form.weight"
            :min="20"
            :max="300"
            :precision="1"
            placeholder="请输入体重"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="运动目标" prop="goalType">
          <el-select v-model="form.goalType" placeholder="请选择运动目标" style="width: 100%;">
            <el-option label="减脂" :value="1" />
            <el-option label="增肌" :value="2" />
            <el-option label="塑形" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动强度" prop="activityLevel">
          <el-select v-model="form.activityLevel" placeholder="请选择活动强度" style="width: 100%;">
            <el-option label="低" :value="1" />
            <el-option label="中" :value="2" />
            <el-option label="高" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            保存
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { UpdateProfileParams } from '@/api/model/userModel'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive<UpdateProfileParams>({
  nickname: '',
  gender: undefined,
  birthday: undefined,
  height: undefined,
  weight: undefined,
  goalType: undefined,
  activityLevel: undefined
})

const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}

const initForm = () => {
  if (userStore.userInfo) {
    form.nickname = userStore.userInfo.nickname || ''
    form.gender = userStore.userInfo.gender
    form.birthday = userStore.userInfo.birthday || undefined
    form.height = userStore.userInfo.height || undefined
    form.weight = userStore.userInfo.weight || undefined
    form.goalType = userStore.userInfo.goalType || undefined
    form.activityLevel = userStore.userInfo.activityLevel || undefined
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    const success = await userStore.updateProfile(form)
    if (success) {
      ElMessage.success('个人信息更新成功')
      router.back()
    } else {
      ElMessage.error('更新失败，请重试')
    }
  } catch (error) {
    console.error('Update profile error:', error)
    ElMessage.error('更新失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  if (!userStore.userInfo) {
    userStore.getProfile().then(() => {
      initForm()
    })
  } else {
    initForm()
  }
})
</script>

<style scoped lang="scss">
.profile-edit-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }
}
</style>

