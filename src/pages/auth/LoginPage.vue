<template>
  <div class="login-container">
    <div class="login-form">
      <h2>欢迎登录动健康</h2>
      <el-form :model="loginForm" :rules="rules" ref="formRef">
        <el-form-item prop="mobile">
          <el-input
              v-model="loginForm.mobile"
              placeholder="请输入手机号"
              prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              style="width: 100%"
              :loading="loading"
              @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <span>还没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';
import type { LoginParams } from '../../api/model/userModel';
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
      router.push('/');
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-form {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }

    .login-footer {
      text-align: center;
      margin-top: 20px;
      color: #666;

      a {
        color: #409eff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>