<template>
  <div id="app">
    <nav v-if="showSidebar" class="main-nav">
      <router-link to="/" class="nav-item">
        <span class="icon">📊</span>
        <span>数据看板</span>
      </router-link>
      <router-link to="/venues" class="nav-item">
        <span class="icon">🏢</span>
        <span>场馆预约</span>
      </router-link>
      <router-link to="/community" class="nav-item">
        <span class="icon">👥</span>
        <span>运动社区</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="icon">👤</span>
        <span>个人中心</span>
      </router-link>
    </nav>

    <main :class="['main-content', { 'full-width': !showSidebar }]">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();

// 根据路由决定是否显示侧边栏
const showSidebar = computed(() => {
  const noSidebarRoutes = ['/login', '/register'];
  return !noSidebarRoutes.includes(route.path);
});

onMounted(() => {
  // 检查登录状态
  const token = localStorage.getItem('token');
  if (token) {
    userStore.token = token;
    // 获取用户信息
    userStore.getProfile();
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  display: flex;
  width: 100%;
}

.main-nav {
  width: 200px;
  min-width: 200px;
  flex-shrink: 0;
  background: #2c3e50;
  color: white;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
}

.nav-item:hover, .nav-item.router-link-active {
  background: #34495e;
}

.nav-item .icon {
  margin-right: 10px;
  font-size: 18px;
}

.main-content {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
  transition: all 0.3s ease;
  min-width: 0; /* 允许 flex 子元素收缩 */
  width: 100%; /* 确保占满剩余空间 */
}

.main-content.full-width {
  width: 100%;
}
</style>