<template>
  <div class="register-container">
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="register-form">
      <div class="form-header">
        <router-link to="/login" class="back-btn">
          <el-icon :size="20"><ArrowLeft /></el-icon>
        </router-link>
        <div class="logo">
          <el-icon :size="40" color="#409EFF"><UserFilled /></el-icon>
        </div>
        <h2>创建账号</h2>
        <p class="subtitle">加入动健康，开启运动之旅</p>
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
              class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置密码（至少6位）"
              size="large"
              :prefix-icon="Lock"
              show-password
              class="custom-input"
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
              class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="nickname">
          <el-input
              v-model="registerForm.nickname"
              placeholder="请输入昵称（2-12个字符）"
              size="large"
              :prefix-icon="UserFilled"
              class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="gender">
          <div class="gender-label">性别</div>
          <el-radio-group v-model="registerForm.gender" class="gender-group">
            <el-radio :label="1" class="gender-radio">
              <el-icon><Male /></el-icon>
              <span>男</span>
            </el-radio>
            <el-radio :label="2" class="gender-radio">
              <el-icon><Female /></el-icon>
              <span>女</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleRegister"
              class="register-button"
          >
            <span v-if="!loading">立即注册</span>
            <span v-else>注册中...</span>
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <span class="footer-text">已有账号？</span>
        <router-link to="/login" class="login-link">
          立即登录
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, ArrowLeft, ArrowRight, UserFilled, Male, Female } from '@element-plus/icons-vue'
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
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 20px;
  overflow: hidden;

  .background-decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 20s infinite ease-in-out;

      &.circle-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        left: -100px;
        animation-delay: 0s;
      }

      &.circle-2 {
        width: 200px;
        height: 200px;
        bottom: -50px;
        right: -50px;
        animation-delay: 5s;
      }

      &.circle-3 {
        width: 150px;
        height: 150px;
        top: 50%;
        right: 10%;
        animation-delay: 10s;
      }
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }

  .register-form {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.6s ease-out;
    overflow: hidden;

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-header {
      position: relative;
      padding: 40px 40px 30px;
      text-align: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);

      .back-btn {
        position: absolute;
        left: 30px;
        top: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        color: #666;
        background: rgba(0, 0, 0, 0.04);
        border-radius: 10px;
        transition: all 0.3s ease;
        text-decoration: none;

        &:hover {
          color: #333;
          background: rgba(0, 0, 0, 0.08);
          transform: translateX(-2px);
        }
      }

      .logo {
        margin-bottom: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 18px;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
      }

      h2 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #999;
        font-weight: 400;
      }
    }

    .register-form-content {
      padding: 30px 40px 20px;

      .custom-input {
        :deep(.el-input__wrapper) {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          }

          &.is-focus {
            box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
          }
        }
      }

      .gender-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
        font-weight: 500;
      }

      .gender-group {
        width: 100%;
        display: flex;
        gap: 16px;

        .gender-radio {
          flex: 1;
          margin: 0;
          padding: 12px 20px;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 15px;

          &:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
          }

          &.is-checked {
            border-color: #667eea;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            color: #667eea;
          }

          :deep(.el-radio__input) {
            display: none;
          }

          :deep(.el-radio__label) {
            padding: 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }

      .register-button {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        margin-top: 10px;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }
    }

    .register-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 25px 40px 35px;
      border-top: 1px solid #f0f0f0;
      background: rgba(0, 0, 0, 0.02);

      .footer-text {
        color: #666;
        font-size: 14px;
      }

      .login-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;

        &:hover {
          color: #764ba2;
          gap: 8px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;

    .register-form {
      .form-header {
        padding: 30px 25px 20px;

        .back-btn {
          left: 20px;
          top: 30px;
        }
      }

      .register-form-content {
        padding: 25px 25px 15px;
      }

      .register-footer {
        padding: 20px 25px 30px;
      }
    }
  }
}
</style>