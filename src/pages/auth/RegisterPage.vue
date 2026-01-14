<template>
  <div class="register-container">
    <div class="register-form">
      <div class="header">
        <router-link to="/login" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
        </router-link>
        <h2>创建账号</h2>
      </div>

      <el-form
          :model="registerForm"
          :rules="rules"
          ref="formRef"
          class="register-form-content"
      >
        <el-form-item prop="mobile">
          <el-input
              v-model="registerForm.mobile"
              placeholder="请输入手机号"
              size="large"
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置密码"
              size="large"
              :prefix-icon="Lock"
              show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              :prefix-icon="Lock"
              show-password
          />
        </el-form-item>

        <el-form-item prop="nickname">
          <el-input
              v-model="registerForm.nickname"
              placeholder="请输入昵称"
              size="large"
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="gender">
          <el-radio-group v-model="registerForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleRegister"
              class="register-btn"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <span>已有账号？</span>
        <router-link to="/login" class="login-link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, ArrowLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { RegisterParams } from '@/api/model/userModel'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
  mobile: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  gender: 1
})

const validatePasswordConfirm = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次密码输入不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePasswordConfirm, trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '昵称长度为2-12个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
})

const handleRegister = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    const registerParams: RegisterParams = {
      mobile: registerForm.mobile,
      password: registerForm.password,
      nickname: registerForm.nickname,
      gender: registerForm.gender
    }

    const success = await userStore.register(registerParams)

    if (success) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error('注册失败')
    }
  } catch (error: any) {
    console.error('Register error:', error)
    const errorMessage = error?.message || '注册失败，请检查网络连接和后端服务'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .register-form {
    width: 100%;
    max-width: 450px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

    .header {
      padding: 30px 40px 20px;
      position: relative;
      text-align: center;

      .back-btn {
        position: absolute;
        left: 30px;
        top: 35px;
        color: #666;
        font-size: 18px;

        &:hover {
          color: #333;
        }
      }

      h2 {
        margin: 0;
        color: #333;
        font-size: 22px;
        font-weight: 600;
      }
    }

    .register-form-content {
      padding: 0 40px 30px;

      .register-btn {
        width: 100%;
        margin-top: 10px;
      }
    }

    .register-footer {
      padding: 20px 40px 30px;
      text-align: center;
      border-top: 1px solid #f0f0f0;
      color: #666;
      font-size: 14px;

      .login-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
        margin-left: 5px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;

    .register-form {
      .header,
      .register-form-content {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  }
}
</style>