<template>
  <div class="login-container">
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    
    <div class="login-form">
      <div class="form-header">
        <div class="logo">
          <el-icon :size="48" color="#409EFF"><Trophy /></el-icon>
        </div>
        <h2>欢迎回来</h2>
        <p class="subtitle">登录您的动健康账号</p>
      </div>
      
      <el-form :model="loginForm" :rules="rules" ref="formRef" class="login-form-content">
        <el-form-item prop="mobile">
          <el-input
              v-model="loginForm.mobile"
              placeholder="请输入手机号"
              size="large"
              :prefix-icon="User"
              class="custom-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              class="custom-input"
              @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-button"
          >
            <span v-if="!loading">立即登录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <span class="footer-text">还没有账号？</span>
        <router-link to="/register" class="register-link">
          立即注册
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, Trophy, ArrowRight } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user.ts';
import type { LoginParams } from "@/api/model/userModel.ts";
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const formRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive<LoginParams>({
  mobile: '',
  password: ''
});

const rules = reactive<FormRules>({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
  ]
});

const handleLogin = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;
    const success = await userStore.login(loginForm);

    if (success) {
      ElMessage.success('登录成功');
      await router.push('/');
    } else {
      ElMessage.error('登录失败，请检查账号密码');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    const errorMessage = error?.message || '登录失败，请检查网络连接和后端服务';
    ElMessage.error(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  overflow: hidden;
  padding: 20px;

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

  .login-form {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    padding: 50px 40px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.6s ease-out;

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
      text-align: center;
      margin-bottom: 40px;

      .logo {
        margin-bottom: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      h2 {
        margin: 0 0 8px 0;
        font-size: 28px;
        font-weight: 700;
        color: #333;
        letter-spacing: -0.5px;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #999;
        font-weight: 400;
      }
    }

    .login-form-content {
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

      .login-button {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }
    }

    .login-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid #f0f0f0;

      .footer-text {
        color: #666;
        font-size: 14px;
      }

      .register-link {
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
  .login-container {
    padding: 10px;

    .login-form {
      padding: 40px 30px;

      .form-header {
        h2 {
          font-size: 24px;
        }
      }
    }
  }
}
</style>